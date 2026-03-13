import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Chart, ChartConfiguration, TooltipItem, registerables } from 'chart.js';
import { NavbarComponent } from '../../shared/navbar.component';

Chart.register(...registerables);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModelParam {
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    val: number;
    dec: number;
    est?: string;
}

export interface ModelDef {
    label: string;
    short: string;
    group: 'math' | 'ml';
    formula: string;
    params: ModelParam[];
}

export interface ForecastResult {
    forecast: number[];
    upper: number[];
    lower: number[];
}

export interface SimStats {
    rmse: number;
    naiveRmse: number;
    theilU: number;
    uBias: number;
    uVar: number;
    uCov: number;
    errors: number[];
    dirAcc: number;
}

// ─── Model definitions ────────────────────────────────────────────────────────

export const MODELS: Record<string, ModelDef> = {
    mrw: {
        label: 'Modified random walk (MRW)', short: 'MRW', group: 'math',
        formula: 'S(t+1) = S(t)·exp(r(t))\nr(t) = μ + κ·(θ − lnS) + ρ·r(t−1) + σ(t)·ε\nσ²(t) = ω + α·ε²(t−1) + β·σ²(t−1)  [GARCH(1,1)]',
        params: [
            { id: 'mu',    label: 'Drift (μ)',             min: -0.001, max: 0.003,  step: 0.0001, val: 0.0005, dec: 4, est: 'drift' },
            { id: 'kappa', label: 'Mean reversion (κ)',     min: 0,      max: 0.5,    step: 0.01,   val: 0.12,   dec: 2, est: 'kappa' },
            { id: 'rho',   label: 'Momentum (ρ)',           min: 0,      max: 0.6,    step: 0.01,   val: 0.22,   dec: 2, est: 'momentum' },
            { id: 'sigma', label: 'Base volatility (σ)',    min: 0.005,  max: 0.06,   step: 0.001,  val: 0.018,  dec: 3, est: 'sigma' },
            { id: 'beta',  label: 'GARCH persistence (β)',  min: 0,      max: 0.9,    step: 0.01,   val: 0.55,   dec: 2 },
        ],
    },
    gbm: {
        label: 'Geometric Brownian motion', short: 'GBM', group: 'math',
        formula: 'S(t+1) = S(t)·exp((μ − σ²/2)·Δt + σ·√Δt·ε)\nε ~ N(0,1),  Δt = 1/252',
        params: [
            { id: 'mu',    label: 'Annual drift (μ)',       min: -0.3,  max: 0.5,  step: 0.01,  val: 0.08, dec: 2, est: 'drift_annual' },
            { id: 'sigma', label: 'Annual volatility (σ)',  min: 0.05,  max: 0.8,  step: 0.01,  val: 0.2,  dec: 2, est: 'sigma_annual' },
        ],
    },
    ou: {
        label: 'Ornstein-Uhlenbeck (OU)', short: 'OU', group: 'math',
        formula: 'dX = κ·(θ − X)·dt + σ·dW\nDiscretized: X(t+1) = X(t) + κ(θ−X(t)) + σ·ε',
        params: [
            { id: 'kappa', label: 'Reversion speed (κ)',    min: 0.01, max: 1.0,  step: 0.01,  val: 0.18, dec: 2, est: 'kappa' },
            { id: 'theta', label: 'Long-run mean (θ)',       min: 3.5,  max: 5.5,  step: 0.01,  val: 4.6,  dec: 2, est: 'theta' },
            { id: 'sigma', label: 'Diffusion (σ)',           min: 0.005,max: 0.08, step: 0.001, val: 0.02, dec: 3, est: 'sigma' },
        ],
    },
    heston: {
        label: 'Heston stochastic volatility', short: 'HESTON', group: 'math',
        formula: 'dS = μ·S·dt + √v·S·dW₁\ndv = κ(θ−v)·dt + ξ·√v·dW₂\ncorr(dW₁,dW₂) = ρ',
        params: [
            { id: 'mu',    label: 'Drift (μ)',              min: 0,      max: 0.003, step: 0.0001, val: 0.0005, dec: 4, est: 'drift' },
            { id: 'kappa', label: 'Vol reversion (κ)',       min: 0.01,   max: 2.0,   step: 0.01,   val: 0.5,   dec: 2 },
            { id: 'theta', label: 'Long-run variance (θ)',   min: 0.0001, max: 0.01,  step: 0.0001, val: 0.0004, dec: 4, est: 'heston_theta' },
            { id: 'xi',    label: 'Vol-of-vol (ξ)',          min: 0.01,   max: 1.0,   step: 0.01,   val: 0.3,   dec: 2 },
            { id: 'rho',   label: 'Correlation (ρ)',         min: -0.9,   max: 0.0,   step: 0.01,   val: -0.5,  dec: 2 },
        ],
    },
    jump: {
        label: 'Jump-diffusion (Merton)', short: 'JUMP', group: 'math',
        formula: 'dS/S = (μ−λ·k̄)dt + σ·dW + J·dN(λ)\nJ ~ lognormal(μj, σj²)',
        params: [
            { id: 'mu',     label: 'Drift (μ)',             min: -0.001, max: 0.003, step: 0.0001, val: 0.0005, dec: 4, est: 'drift' },
            { id: 'sigma',  label: 'Diffusion (σ)',         min: 0.005,  max: 0.05,  step: 0.001,  val: 0.015,  dec: 3, est: 'sigma' },
            { id: 'lambda', label: 'Jump intensity (λ)',     min: 0,      max: 0.1,   step: 0.001,  val: 0.02,   dec: 3, est: 'lambda' },
            { id: 'muj',    label: 'Jump mean (μj)',         min: -0.1,   max: 0.0,   step: 0.005,  val: -0.03,  dec: 3 },
            { id: 'sigj',   label: 'Jump std (σj)',          min: 0.01,   max: 0.15,  step: 0.005,  val: 0.05,   dec: 3 },
        ],
    },
    arima: {
        label: 'ARIMA', short: 'ARIMA', group: 'ml',
        formula: '(1−φ₁B−…−φₚBᵖ)(1−B)ᵈ Xₜ = (1+θ₁B+…+θqBq)εₜ\nForecast on log-returns',
        params: [
            { id: 'p',        label: 'AR order (p)',        min: 1,    max: 5,   step: 1,     val: 2,    dec: 0, est: 'ar_order' },
            { id: 'd',        label: 'Integration (d)',     min: 0,    max: 2,   step: 1,     val: 1,    dec: 0, est: 'd_order' },
            { id: 'q',        label: 'MA order (q)',        min: 0,    max: 5,   step: 1,     val: 1,    dec: 0, est: 'ma_order' },
            { id: 'phi',      label: 'AR coefficient (φ)',  min: -0.9, max: 0.9, step: 0.01,  val: 0.25, dec: 2, est: 'ar_coef' },
            { id: 'theta_ma', label: 'MA coefficient (θ)',  min: -0.9, max: 0.9, step: 0.01,  val: 0.15, dec: 2 },
        ],
    },
    lstm: {
        label: 'LSTM neural network', short: 'LSTM', group: 'ml',
        formula: 'fₜ=σ(Wf·[hₜ₋₁,xₜ]+bf)  [forget gate]\niₜ=σ(Wi·[hₜ₋₁,xₜ]+bi)  [input gate]\nhₜ=oₜ⊗tanh(Cₜ)',
        params: [
            { id: 'look',   label: 'Lookback window',       min: 5,    max: 60,  step: 1,     val: 20,   dec: 0, est: 'lookback' },
            { id: 'units',  label: 'Hidden units',          min: 16,   max: 256, step: 8,     val: 64,   dec: 0 },
            { id: 'lr',     label: 'Learning rate',         min: 0.0001,max: 0.01,step: 0.0001,val: 0.001,dec: 4 },
            { id: 'drop',   label: 'Dropout rate',          min: 0,    max: 0.5, step: 0.05,  val: 0.2,  dec: 2 },
            { id: 'epochs', label: 'Epochs',                min: 10,   max: 200, step: 10,    val: 50,   dec: 0 },
        ],
    },
    xgb: {
        label: 'XGBoost regression', short: 'XGB', group: 'ml',
        formula: 'F(x) = Σk fk(x)  (regression trees)\nObjective: Σi l(yi,ŷi) + Σk Ω(fk)\nFeatures: lagged returns, rolling vol, RSI',
        params: [
            { id: 'depth', label: 'Max tree depth',         min: 2,  max: 10,  step: 1,    val: 4,   dec: 0 },
            { id: 'trees', label: 'Num estimators',         min: 50, max: 500, step: 10,   val: 150, dec: 0 },
            { id: 'lr',    label: 'Learning rate (η)',       min: 0.01,max: 0.3,step: 0.01, val: 0.05,dec: 2 },
            { id: 'sub',   label: 'Subsample ratio',        min: 0.5,max: 1.0, step: 0.05, val: 0.8, dec: 2 },
            { id: 'lag',   label: 'Lag features',           min: 1,  max: 30,  step: 1,    val: 10,  dec: 0, est: 'lookback' },
        ],
    },
    gp: {
        label: 'Gaussian process', short: 'GP', group: 'ml',
        formula: "f(x) ~ GP(m(x), k(x,x'))\nk(x,x') = σ²·exp(−|x−x'|²/2ℓ²)\nŷ = K(X*,X)[K(X,X)+σ²I]⁻¹y",
        params: [
            { id: 'l',  label: 'Length scale (ℓ)',          min: 1,   max: 30,  step: 0.5,  val: 10,  dec: 1, est: 'lookback' },
            { id: 'sf', label: 'Signal variance (σf)',       min: 0.1, max: 5,   step: 0.1,  val: 1.5, dec: 1 },
            { id: 'sn', label: 'Noise variance (σn)',        min: 0.01,max: 1.0, step: 0.01, val: 0.1, dec: 2, est: 'sigma' },
            { id: 'nu', label: 'Smoothness (ν)',             min: 0.5, max: 2.5, step: 0.5,  val: 1.5, dec: 1 },
        ],
    },
    ensemble: {
        label: 'Ensemble (MRW+ARIMA+GP)', short: 'ENS', group: 'ml',
        formula: 'ŷ = w₁·f_MRW + w₂·f_ARIMA + w₃·f_GP\nweights: inverse validation RMSE\nw₁+w₂+w₃=1, wi≥0',
        params: [
            { id: 'w1',    label: 'MRW weight (w₁)',         min: 0,    max: 1,    step: 0.05, val: 0.4,  dec: 2, est: 'eq_weight' },
            { id: 'w2',    label: 'ARIMA weight (w₂)',       min: 0,    max: 1,    step: 0.05, val: 0.35, dec: 2, est: 'eq_weight' },
            { id: 'w3',    label: 'GP weight (w₃)',          min: 0,    max: 1,    step: 0.05, val: 0.25, dec: 2, est: 'eq_weight' },
            { id: 'kappa', label: 'MRW reversion (κ)',        min: 0,    max: 0.5,  step: 0.01, val: 0.12, dec: 2 },
            { id: 'sigma', label: 'Base volatility (σ)',      min: 0.005,max: 0.06, step: 0.001,val: 0.018,dec: 3, est: 'sigma' },
        ],
    },
};

export const MODEL_KEYS = Object.keys(MODELS);
export const MATH_KEYS  = MODEL_KEYS.filter(k => MODELS[k].group === 'math');
export const ML_KEYS    = MODEL_KEYS.filter(k => MODELS[k].group === 'ml');
const SIM_N = 120;

// ─── Pure math helpers ────────────────────────────────────────────────────────

function randn(): number {
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function generateActual(N = SIM_N): number[] {
    const prices = [100]; let vol = 0.018, prevR = 0;
    for (let i = 1; i < N; i++) {
        const eps = randn();
        vol = Math.sqrt(0.00002 + 0.12 * eps * eps * vol * vol + 0.6 * vol * vol);
        vol = Math.min(Math.max(vol, 0.005), 0.08);
        const r = 0.0003 + 0.15 * prevR + vol * eps; prevR = r;
        prices.push(Math.max(prices[i - 1] * Math.exp(r), 1));
    }
    return prices;
}

function runEstimator(estKey: string, actual: number[]): number | null {
    const returns: number[] = [];
    for (let i = 1; i < actual.length; i++) returns.push(Math.log(actual[i] / actual[i - 1]));
    const mean = returns.reduce((s, v) => s + v, 0) / returns.length;
    const variance = returns.reduce((s, v) => s + (v - mean) ** 2, 0) / returns.length;
    const sigma = Math.sqrt(variance);
    switch (estKey) {
        case 'drift':         return +mean.toFixed(6);
        case 'drift_annual':  return +(mean * 252).toFixed(3);
        case 'sigma':         return +Math.min(Math.max(sigma, 0.005), 0.1).toFixed(4);
        case 'sigma_annual':  return +(sigma * Math.sqrt(252)).toFixed(3);
        case 'kappa': {
            const lp = actual.map(Math.log), lm = lp.reduce((s, v) => s + v, 0) / lp.length;
            let c = 0, v2 = 0;
            for (let i = 0; i < lp.length - 1; i++) { c += (lp[i] - lm) * (lp[i + 1] - lm); v2 += (lp[i] - lm) ** 2; }
            return +Math.max(1 - (v2 > 0 ? c / v2 : 0), 0.01).toFixed(3);
        }
        case 'theta':         return +(actual.map(Math.log).reduce((s, v) => s + v, 0) / actual.length).toFixed(3);
        case 'momentum': {
            let c = 0, v2 = 0;
            for (let i = 0; i < returns.length - 1; i++) { c += (returns[i] - mean) * (returns[i + 1] - mean); v2 += (returns[i] - mean) ** 2; }
            return +Math.min(Math.max(v2 > 0 ? c / v2 : 0, 0), 0.6).toFixed(3);
        }
        case 'heston_theta':  return +Math.min(Math.max(variance, 0.0001), 0.01).toFixed(6);
        case 'lambda':        return +(returns.filter(r => Math.abs(r - mean) > 3 * sigma).length / returns.length).toFixed(4);
        case 'ar_order':      return 2;
        case 'd_order':       return 1;
        case 'ma_order':      return 1;
        case 'ar_coef': {
            let c = 0, v2 = 0;
            for (let i = 0; i < returns.length - 1; i++) { c += (returns[i] - mean) * (returns[i + 1] - mean); v2 += (returns[i] - mean) ** 2; }
            return +Math.min(Math.max(v2 > 0 ? c / v2 : 0, -0.9), 0.9).toFixed(3);
        }
        case 'lookback':      return 20;
        case 'eq_weight':     return 0.33;
        default:              return null;
    }
}

function computeForecast(modelKey: string, p: Record<string, number>, actual: number[]): ForecastResult {
    const N = actual.length;
    const thetaEst = actual.map(Math.log).reduce((s, v) => s + v, 0) / N;
    const returns: number[] = [];
    for (let i = 1; i < actual.length; i++) returns.push(Math.log(actual[i] / actual[i - 1]));
    const meanR = returns.reduce((s, v) => s + v, 0) / returns.length;
    const forecast = [actual[0]], upper = [actual[0]], lower = [actual[0]];
    let vol = 0.018, prevR = 0, cumVar = 0;

    const push = (nx: number, bs = 0.7) => {
        forecast.push(nx); cumVar += vol * vol;
        const band = nx * Math.sqrt(cumVar) * bs;
        upper.push(nx + band); lower.push(Math.max(nx - band, 0.01));
    };

    if (modelKey === 'mrw') {
        const alpha = 0.15, omega = p['sigma'] * p['sigma'] * (1 - alpha - p['beta']) * 0.5;
        for (let i = 1; i < N; i++) {
            const lnS = Math.log(forecast[i - 1]), eps = randn();
            vol = Math.sqrt(Math.max(omega + alpha * eps * eps * vol * vol + p['beta'] * vol * vol, 1e-8));
            vol = Math.min(vol, 0.1);
            const r = p['mu'] + p['kappa'] * (thetaEst - lnS) + p['rho'] * prevR + vol * eps; prevR = r;
            push(forecast[i - 1] * Math.exp(r), 0.8);
        }
    } else if (modelKey === 'gbm') {
        const dt = 1 / 252; vol = p['sigma'] * Math.sqrt(dt);
        for (let i = 1; i < N; i++)
            push(forecast[i - 1] * Math.exp((p['mu'] - 0.5 * p['sigma'] ** 2) * dt + p['sigma'] * Math.sqrt(dt) * randn()), 0.6);
    } else if (modelKey === 'ou') {
        let lnS = Math.log(forecast[0]); vol = p['sigma'];
        for (let i = 1; i < N; i++) { lnS += p['kappa'] * (p['theta'] - lnS) + p['sigma'] * randn(); push(Math.exp(lnS), 0.5); }
    } else if (modelKey === 'heston') {
        let v = p['theta']; vol = Math.sqrt(v);
        for (let i = 1; i < N; i++) {
            const e1 = randn(), e2c = p['rho'] * e1 + Math.sqrt(1 - p['rho'] ** 2) * randn();
            v = Math.max(v + p['kappa'] * (p['theta'] - v) + p['xi'] * Math.sqrt(Math.max(v, 0)) * e2c, 0.00001); vol = Math.sqrt(v);
            push(forecast[i - 1] * Math.exp(p['mu'] + vol * e1), 0.5);
        }
    } else if (modelKey === 'jump') {
        vol = p['sigma'];
        for (let i = 1; i < N; i++) {
            const jump = Math.random() < p['lambda'] ? Math.exp(p['muj'] + p['sigj'] * randn()) - 1 : 0;
            const kbar = Math.exp(p['muj'] + 0.5 * p['sigj'] ** 2) - 1;
            push(forecast[i - 1] * Math.exp((p['mu'] - p['lambda'] * kbar) + p['sigma'] * randn() + jump), 0.7);
        }
    } else if (modelKey === 'arima') {
        vol = 0.015; let prevEps = 0, prevR2 = meanR;
        for (let i = 1; i < N; i++) {
            const eps = randn() * 0.015, r = meanR + p['phi'] * (prevR2 - meanR) + p['theta_ma'] * prevEps + eps;
            prevEps = eps; prevR2 = r; push(forecast[i - 1] * Math.exp(r), 0.6);
        }
    } else if (modelKey === 'lstm') {
        const sig2 = 0.016 * (1 - p['drop']); vol = sig2;
        const buf = returns.slice(-Math.round(p['look']));
        for (let i = 1; i < N; i++) {
            const avg = buf.reduce((s, v) => s + v, 0) / buf.length;
            const r = avg * 0.6 + (buf[buf.length - 1] - buf[0]) * 0.1 + sig2 * randn();
            buf.shift(); buf.push(r); push(forecast[i - 1] * Math.exp(r), 0.5);
        }
    } else if (modelKey === 'xgb') {
        vol = 0.014; const buf = returns.slice(-Math.round(p['lag']));
        for (let i = 1; i < N; i++) {
            const r = buf.reduce((s, v) => s + v, 0) / buf.length * 0.4 + 0.014 * randn();
            buf.shift(); buf.push(r); push(forecast[i - 1] * Math.exp(r), 0.55);
        }
    } else if (modelKey === 'gp') {
        vol = p['sn'];
        for (let i = 1; i < N; i++) {
            let wS = 0, wY = 0;
            for (let j = 0; j < returns.length; j++) {
                const k = p['sf'] ** 2 * Math.exp(-0.5 * ((i - j) / p['l']) ** 2); wS += k; wY += k * returns[j];
            }
            push(forecast[i - 1] * Math.exp((wS > 0 ? wY / wS : meanR) + p['sn'] * randn()), 0.6);
        }
    } else if (modelKey === 'ensemble') {
        const tot = p['w1'] + p['w2'] + p['w3'] || 1;
        const [w1, w2, w3] = [p['w1'] / tot, p['w2'] / tot, p['w3'] / tot];
        vol = p['sigma']; const buf = returns.slice(-20);
        for (let i = 1; i < N; i++) {
            const lnS = Math.log(forecast[i - 1]), eps = randn();
            const r_mrw = 0.0005 + p['kappa'] * (thetaEst - lnS) + 0.2 * prevR + vol * eps;
            const r_ar  = meanR + 0.25 * (prevR - meanR) + 0.015 * randn();
            let wS = 0, wY = 0;
            for (let j = 0; j < returns.length; j++) {
                const k = p['sigma'] ** 2 * Math.exp(-0.5 * ((i - j) / 10) ** 2); wS += k; wY += k * returns[j];
            }
            const r = w1 * r_mrw + w2 * r_ar + w3 * ((wS > 0 ? wY / wS : meanR) + 0.01 * randn());
            prevR = r_mrw; buf.shift(); buf.push(r);
            push(forecast[i - 1] * Math.exp(r), 0.45);
        }
    }
    return { forecast, upper, lower };
}

function computeStats(actual: number[], forecast: number[]): SimStats {
    const N = actual.length, naive = [actual[0], ...actual.slice(0, N - 1)];
    const errors   = actual.map((a, i) => a - forecast[i]);
    const naiveErr = actual.map((a, i) => a - naive[i]);
    const mse      = errors.slice(1).reduce((s, e) => s + e * e, 0) / (N - 1);
    const naiveMse = naiveErr.slice(1).reduce((s, e) => s + e * e, 0) / (N - 1);
    const rmse = Math.sqrt(mse), naiveRmse = Math.sqrt(naiveMse), theilU = rmse / (rmse + naiveRmse);
    const mF = forecast.slice(1).reduce((a, b) => a + b, 0) / (N - 1);
    const mA = actual.slice(1).reduce((a, b) => a + b, 0) / (N - 1);
    const sF = Math.sqrt(forecast.slice(1).reduce((s, v) => s + (v - mF) ** 2, 0) / (N - 1));
    const sA = Math.sqrt(actual.slice(1).reduce((s, v) => s + (v - mA) ** 2, 0) / (N - 1));
    const uBias = (mF - mA) ** 2 / mse, uVar = (sF - sA) ** 2 / mse, uCov = Math.max(0, 1 - uBias - uVar);
    let dirOk = 0;
    for (let i = 1; i < N; i++) if ((actual[i] > actual[i - 1]) === (forecast[i] > forecast[i - 1])) dirOk++;
    return { rmse, naiveRmse, theilU, uBias, uVar, uCov, errors, dirAcc: dirOk / (N - 1) * 100 };
}

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
    selector: 'app-predictor',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
    :host { display: block; }

    /* ── Page shell — 120px top pad matches every other route in the project ── */
    .sim-page {
      padding: 120px 48px 80px;
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    /* ── Page header — mirrors overview.component.css .page-header ── */
    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 32px;
    }
    .page-title {
      font-size: 1.9rem;
      font-weight: 800;
      letter-spacing: -0.05em;
      color: #fff;
      line-height: 1.1;
    }
    .page-title span { color: var(--accent-bright); }
    .page-sub {
      margin-top: 6px;
      font-size: 0.8rem;
      color: var(--muted);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .live-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: 999px;
      border: 1px solid rgba(100,140,255,0.3);
      background: rgba(100,140,255,0.08);
      font-size: 0.72rem;
      color: var(--accent-bright);
    }
    .live-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 6px var(--accent);
      animation: blink 2s infinite;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.35} }

    /* ── Buttons — match project's .btn-ghost / .btn-signin style ── */
    .action-row { display: flex; gap: 8px; }
    .btn-primary {
      background: linear-gradient(135deg, var(--blue), var(--purple));
      border: none; color: #fff;
      padding: 10px 24px; border-radius: 10px;
      font-family: inherit; font-size: 0.82rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
      box-shadow: 0 4px 18px rgba(61,90,255,0.38);
    }
    .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
    .btn-ghost {
      background: none;
      border: 1px solid rgba(255,255,255,0.07);
      color: var(--muted);
      padding: 10px 20px; border-radius: 10px;
      font-family: inherit; font-size: 0.82rem; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-ghost:hover { color: var(--text); border-color: var(--border-accent); background: rgba(100,140,255,0.07); }

    /* ── Stat cards ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: var(--glass);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 20px 22px;
      backdrop-filter: blur(22px);
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .stat-card:hover {
      border-color: var(--border-accent);
      box-shadow: 0 0 0 1px rgba(100,140,255,0.16), 0 8px 32px rgba(61,90,255,0.1);
    }
    .stat-glow {
      position: absolute; top: -28px; right: -28px;
      width: 96px; height: 96px; border-radius: 50%;
      background: radial-gradient(circle, var(--gc, var(--accent)) 0%, transparent 70%);
      opacity: 0.15; pointer-events: none;
    }
    .stat-label {
      font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--muted); margin-bottom: 10px;
    }
    .stat-value {
      font-size: 1.7rem; font-weight: 800;
      letter-spacing: -0.04em; color: #fff;
      line-height: 1; margin-bottom: 6px;
    }
    .stat-sub { font-size: 0.75rem; color: var(--muted); }

    /* ── Badges — match .hero-tag pill style ── */
    .badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 2px 9px; border-radius: 20px;
      font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .badge-green  { background: rgba(0,229,160,0.1);  color: rgba(170,255,210,0.9); border: 1px solid rgba(0,229,160,0.25); }
    .badge-purple { background: rgba(108,63,255,0.14); color: #c4adff;               border: 1px solid rgba(108,63,255,0.3); }
    .badge-accent { background: rgba(100,140,255,0.1); color: var(--accent-bright);  border: 1px solid rgba(100,140,255,0.25); }

    /* ── Main grid ── */
    .main-grid {
      display: grid;
      grid-template-columns: 1fr 296px;
      gap: 16px;
      align-items: start;
    }
    .col-left  { display: flex; flex-direction: column; gap: 16px; }
    .col-right { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 90px; }

    /* ── Glass card — mirrors .fcard / .rcard ── */
    .card {
      background: var(--glass);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      backdrop-filter: blur(22px);
      box-shadow: 0 4px 30px rgba(0,0,0,0.18);
      transition: border-color 0.3s;
    }
    .card:hover { border-color: var(--border-accent); }
    .card-header {
      padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center;
      justify-content: space-between; flex-wrap: wrap; gap: 8px;
    }
    .card-title-row { display: flex; align-items: center; gap: 10px; }
    .card-title { font-weight: 700; font-size: 0.88rem; color: var(--text); }
    .card-body  { padding: 18px 20px; }

    /* ── Tabs ── */
    .tab-row { display: flex; gap: 3px; }
    .tab {
      padding: 5px 14px; border: none; border-radius: 8px;
      background: transparent; color: var(--muted);
      font-size: 0.75rem; cursor: pointer; font-family: inherit;
      border-bottom: 1.5px solid transparent; transition: all 0.15s;
    }
    .tab:hover { color: var(--text); background: rgba(100,140,255,0.06); }
    .tab-active {
      background: rgba(100,140,255,0.1); color: var(--accent-bright);
      border-bottom-color: var(--accent); font-weight: 600;
    }

    /* ── Chart ── */
    .chart-area { padding: 10px 8px 10px; }
    .legend { display: flex; gap: 14px; padding: 0 12px 10px; flex-wrap: wrap; }
    .legend-item { display: flex; align-items: center; gap: 5px; font-size: 0.72rem; color: var(--muted); }
    .legend-line { width: 18px; height: 2px; border-radius: 2px; }
    .legend-band {
      width: 18px; height: 7px; border-radius: 2px;
      background: rgba(100,140,255,0.1); border: 1px solid rgba(100,140,255,0.22);
    }
    .canvas-wrap { position: relative; width: 100%; height: 260px; }

    /* ── Section label ── */
    .sec-label {
      font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--muted); margin-bottom: 14px;
    }

    /* ── Formula ── */
    .formula-wrap { padding: 18px 20px; }
    .formula-pre {
      background: rgba(10,14,40,0.55); border: 1px solid var(--border);
      border-radius: 12px; padding: 14px 16px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.75rem; color: var(--text);
      line-height: 1.9; white-space: pre-wrap; margin-bottom: 12px;
    }
    .formula-about {
      padding: 12px 14px;
      background: rgba(100,140,255,0.05); border: 1px solid var(--border-accent);
      border-radius: 10px;
    }
    .formula-about-label {
      font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.09em; color: var(--accent); margin-bottom: 4px;
    }
    .formula-about-text { font-size: 0.78rem; color: var(--muted); line-height: 1.6; }

    /* ── Theil decomp ── */
    .theil-row { margin-bottom: 14px; }
    .theil-row-head { display: flex; justify-content: space-between; margin-bottom: 5px; }
    .theil-row-label { font-size: 0.75rem; color: var(--muted); }
    .theil-row-pct { font-size: 0.78rem; font-weight: 700; color: var(--text); font-family: 'JetBrains Mono', monospace; }
    .theil-track { height: 4px; background: var(--border); border-radius: 4px; overflow: hidden; }
    .theil-fill { height: 100%; border-radius: 4px; transition: width 0.5s cubic-bezier(.4,0,.2,1); }
    .theil-note {
      margin-top: 14px; padding: 10px 14px;
      background: rgba(0,229,160,0.05); border: 1px solid rgba(0,229,160,0.18);
      border-radius: 10px; font-size: 0.75rem; color: var(--muted); line-height: 1.7;
    }

    /* ── Model dropdown ── */
    .dropdown-wrap { position: relative; }
    .dropdown-trigger {
      width: 100%; display: flex; align-items: center;
      justify-content: space-between;
      padding: 10px 14px; border-radius: 12px;
      border: 1px solid var(--border);
      background: rgba(10,14,40,0.45); color: var(--text);
      font-size: 0.82rem; font-weight: 600;
      cursor: pointer; font-family: inherit; transition: border-color 0.2s;
    }
    .dropdown-trigger:hover, .dropdown-trigger.open { border-color: var(--border-accent); }
    .dropdown-trigger-inner { display: flex; align-items: center; gap: 10px; }
    .dropdown-arrow { color: var(--muted); font-size: 0.6rem; transition: transform 0.2s; }
    .dropdown-arrow.open { transform: rotate(180deg); }
    .dropdown-menu {
      position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 200;
      background: rgba(8,12,38,0.97); border: 1px solid var(--border-accent);
      border-radius: 14px; overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.55); backdrop-filter: blur(20px);
    }
    .dropdown-group-label {
      font-size: 0.65rem; color: var(--muted); text-transform: uppercase;
      letter-spacing: 0.09em; padding: 10px 14px 4px;
    }
    .dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }
    .dropdown-item {
      padding: 9px 14px; font-size: 0.8rem; cursor: pointer;
      display: flex; align-items: center; gap: 10px;
      color: var(--muted); transition: background 0.1s;
    }
    .dropdown-item:hover { background: rgba(100,140,255,0.07); }
    .dropdown-item.item-active { color: var(--text); }
    .dropdown-item.item-active.math { background: rgba(0,229,160,0.07); }
    .dropdown-item.item-active.ml   { background: rgba(108,63,255,0.1); }

    /* ── Param sliders ── */
    .param-row { margin-bottom: 16px; }
    .param-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
    .param-label { font-size: 0.78rem; color: var(--muted); }
    .param-right { display: flex; align-items: center; gap: 8px; }
    .param-value {
      font-size: 0.78rem; font-weight: 700; color: var(--text);
      font-family: 'JetBrains Mono', monospace; min-width: 54px; text-align: right;
    }
    .est-btn {
      font-size: 0.65rem; padding: 2px 9px; border-radius: 20px;
      border: 1px solid var(--border-accent); background: transparent;
      color: var(--accent); cursor: pointer; font-family: inherit;
      letter-spacing: 0.04em; transition: all 0.15s;
    }
    .est-btn:hover { background: rgba(100,140,255,0.1); }
    .est-btn.loading { color: var(--muted); border-color: var(--border); }
    .slider {
      width: 100%; height: 3px; appearance: none;
      -webkit-appearance: none; border-radius: 4px; outline: none; cursor: pointer;
    }
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%;
      background: var(--accent); border: 2px solid var(--c1);
      box-shadow: 0 0 6px rgba(100,140,255,0.5); cursor: pointer;
    }
    .slider::-moz-range-thumb {
      width: 13px; height: 13px; border-radius: 50%;
      background: var(--accent); border: 2px solid var(--c1); cursor: pointer;
    }

    /* ── Stats table ── */
    .stats-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 7px 0; border-bottom: 1px solid var(--border);
    }
    .stats-row:last-child { border-bottom: none; }
    .stats-key { font-size: 0.75rem; color: var(--muted); }
    .stats-val { font-size: 0.78rem; font-weight: 700; font-family: 'JetBrains Mono', monospace; }

    /* ── Responsive — matches project breakpoints ── */
    @media (max-width: 900px) {
      .sim-page   { padding: 100px 20px 60px; }
      .main-grid  { grid-template-columns: 1fr; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .col-right  { position: static; }
    }
    @media (max-width: 500px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `],
    template: `
<div class="bg"></div>
<div class="bg-halo"></div>

<app-navbar />

<main>
<div class="sim-page">

  <!-- ── Page header ── -->
  <div class="page-header">
    <div>
      <div class="page-title">Price <span>Simulator</span></div>
      <div class="page-sub">
        Stochastic forecast · Theil-U optimized &nbsp;·&nbsp;
        <span class="live-pill"><span class="live-dot"></span>{{ N }} simulation steps</span>
      </div>
    </div>
    <div class="action-row">
      <button class="btn-primary" (click)="runSimulation()">▶&nbsp; Run simulation</button>
      <button class="btn-ghost"   (click)="randomize()">↺&nbsp; Randomize</button>
    </div>
  </div>

  <!-- ── Stat cards ── -->
  <div class="stats-grid">

    <div class="stat-card">
      <div class="stat-glow" [style.--gc]="theilColor"></div>
      <div class="stat-label">Theil U</div>
      <div class="stat-value" [style.color]="theilColor">{{ stats ? stats.theilU.toFixed(3) : '—' }}</div>
      <div class="stat-sub">
        <span *ngIf="theilLabel" class="badge"
              [style.background]="theilColor + '1a'"
              [style.color]="theilColor"
              [style.border]="'1px solid ' + theilColor + '44'">
          {{ theilLabel }}
        </span>
        <span *ngIf="!theilLabel">U &lt; 1 beats naive</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-glow" style="--gc: var(--accent)"></div>
      <div class="stat-label">Model RMSE</div>
      <div class="stat-value">{{ stats ? stats.rmse.toFixed(2) : '—' }}</div>
      <div class="stat-sub">{{ stats ? 'Naive: ' + stats.naiveRmse.toFixed(2) : '' }}</div>
    </div>

    <div class="stat-card">
      <div class="stat-glow" style="--gc: #a07eff"></div>
      <div class="stat-label">Directional accuracy</div>
      <div class="stat-value">{{ stats ? stats.dirAcc.toFixed(1) + '%' : '—' }}</div>
      <div class="stat-sub">correct next-step direction</div>
    </div>

    <div class="stat-card">
      <div class="stat-glow" style="--gc: #fbbf24"></div>
      <div class="stat-label">Last price</div>
      <div class="stat-value">\${{ priceLast.toFixed(2) }}</div>
      <div class="stat-sub" [style.color]="priceDelta >= 0 ? 'rgba(0,229,160,0.9)' : '#f87171'" style="font-weight:700">
        {{ priceDelta >= 0 ? '+' : '' }}{{ priceDelta.toFixed(2) }}% total drift
      </div>
    </div>

  </div>

  <!-- ── Main grid ── -->
  <div class="main-grid">

    <!-- LEFT -->
    <div class="col-left">

      <!-- Chart card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title-row">
            <span class="card-title">Price simulation</span>
            <span class="badge badge-green">● Live</span>
          </div>
          <div class="tab-row">
            <button class="tab" [class.tab-active]="activeTab==='chart'"     (click)="setTab('chart')">Chart</button>
            <button class="tab" [class.tab-active]="activeTab==='residuals'" (click)="setTab('residuals')">Residuals</button>
            <button class="tab" [class.tab-active]="activeTab==='formula'"   (click)="setTab('formula')">Formula</button>
          </div>
        </div>

        <div *ngIf="activeTab==='chart'" class="chart-area">
          <div class="legend">
            <span class="legend-item"><span class="legend-line" style="background:var(--accent-bright)"></span>Actual</span>
            <span class="legend-item"><span class="legend-line" style="background:#f87171"></span>Forecast</span>
            <span class="legend-item"><span class="legend-line" style="background:var(--dim)"></span>Naive</span>
            <span class="legend-item"><span class="legend-band"></span>Confidence ±1σ</span>
          </div>
          <div class="canvas-wrap"><canvas #priceCanvas></canvas></div>
        </div>

        <div *ngIf="activeTab==='residuals'" class="chart-area">
          <div class="canvas-wrap"><canvas #residCanvas></canvas></div>
        </div>

        <div *ngIf="activeTab==='formula'" class="formula-wrap">
          <pre class="formula-pre">{{ cfg.formula }}</pre>
          <div class="formula-about">
            <div class="formula-about-label">About</div>
            <div class="formula-about-text">
              {{ cfg.label }} —
              {{ cfg.group === 'math' ? 'Mathematical stochastic process' : 'Machine learning regressor' }}
              · {{ cfg.params.length }} parameters
            </div>
          </div>
        </div>
      </div>

      <!-- Theil decomposition -->
      <div class="card">
        <div class="card-body">
          <div class="sec-label">Theil U decomposition</div>
          <ng-container *ngIf="stats">
            <div class="theil-row">
              <div class="theil-row-head">
                <span class="theil-row-label">Bias (U^M) — systematic over/under-prediction</span>
                <span class="theil-row-pct">{{ (stats.uBias * 100).toFixed(1) }}%</span>
              </div>
              <div class="theil-track">
                <div class="theil-fill" [style.width.%]="clamp(stats.uBias * 100)"
                     style="background:#f87171; box-shadow:0 0 6px rgba(248,113,113,0.5)"></div>
              </div>
            </div>
            <div class="theil-row">
              <div class="theil-row-head">
                <span class="theil-row-label">Variance (U^S) — wrong amplitude</span>
                <span class="theil-row-pct">{{ (stats.uVar * 100).toFixed(1) }}%</span>
              </div>
              <div class="theil-track">
                <div class="theil-fill" [style.width.%]="clamp(stats.uVar * 100)"
                     style="background:#fbbf24; box-shadow:0 0 6px rgba(251,191,36,0.5)"></div>
              </div>
            </div>
            <div class="theil-row">
              <div class="theil-row-head">
                <span class="theil-row-label">Covariance (U^C) — irreducible noise</span>
                <span class="theil-row-pct">{{ (stats.uCov * 100).toFixed(1) }}%</span>
              </div>
              <div class="theil-track">
                <div class="theil-fill" [style.width.%]="clamp(stats.uCov * 100)"
                     style="background:rgba(0,229,160,0.85); box-shadow:0 0 6px rgba(0,229,160,0.45)"></div>
              </div>
            </div>
            <div class="theil-note">
              Ideal: most error in U^C (noise), minimal U^M (bias) and U^S (variance mismatch).
            </div>
          </ng-container>
        </div>
      </div>

    </div><!-- /col-left -->

    <!-- RIGHT -->
    <div class="col-right">

      <!-- Model selector -->
      <div class="card">
        <div class="card-body">
          <div class="sec-label">Active model</div>
          <div class="dropdown-wrap">
            <button class="dropdown-trigger" [class.open]="dropdownOpen" (click)="dropdownOpen = !dropdownOpen">
              <span class="dropdown-trigger-inner">
                <span class="badge" [ngClass]="cfg.group === 'math' ? 'badge-green' : 'badge-purple'">{{ cfg.short }}</span>
                {{ cfg.label }}
              </span>
              <span class="dropdown-arrow" [class.open]="dropdownOpen">▼</span>
            </button>
            <div *ngIf="dropdownOpen" class="dropdown-menu">
              <div class="dropdown-group-label">Mathematical models</div>
              <div *ngFor="let key of mathKeys" class="dropdown-item math"
                   [class.item-active]="modelKey === key" (click)="selectModel(key)">
                <span class="badge badge-green">{{ models[key].short }}</span>{{ models[key].label }}
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-group-label">Machine learning</div>
              <div *ngFor="let key of mlKeys" class="dropdown-item ml"
                   [class.item-active]="modelKey === key" (click)="selectModel(key)">
                <span class="badge badge-purple">{{ models[key].short }}</span>{{ models[key].label }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Parameters -->
      <div class="card">
        <div class="card-body">
          <div class="sec-label">Parameters</div>
          <div *ngFor="let param of cfg.params" class="param-row">
            <div class="param-header">
              <span class="param-label">{{ param.label }}</span>
              <div class="param-right">
                <span class="param-value">{{ formatVal(param) }}</span>
                <button *ngIf="param.est" class="est-btn" [class.loading]="estimatingId === param.id"
                        (click)="estimate(param)">
                  {{ estimatingId === param.id ? '…' : 'Estimate' }}
                </button>
              </div>
            </div>
            <input type="range" class="slider"
                   [min]="param.min" [max]="param.max" [step]="param.step"
                   [value]="paramVals[modelKey + '_' + param.id]"
                   [style.background]="sliderBg(param)"
                   (input)="onParamChange(param, $event)" />
          </div>
        </div>
      </div>

      <!-- Stats table -->
      <div class="card">
        <div class="card-body">
          <div class="sec-label">Statistics</div>
          <div *ngFor="let row of statsRows" class="stats-row">
            <span class="stats-key">{{ row.label }}</span>
            <span class="stats-val" [style.color]="row.color">{{ row.value }}</span>
          </div>
        </div>
      </div>

    </div><!-- /col-right -->
  </div><!-- /main-grid -->
</div>
</main>
  `,
})
export class PredictorComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('priceCanvas') priceCanvasRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('residCanvas') residCanvasRef!: ElementRef<HTMLCanvasElement>;

    readonly N        = SIM_N;
    readonly models   = MODELS;
    readonly mathKeys = MATH_KEYS;
    readonly mlKeys   = ML_KEYS;

    modelKey      = 'mrw';
    paramVals: Record<string, number> = {};
    actual: number[]              = [];
    result: ForecastResult | null = null;
    stats: SimStats | null        = null;
    estimatingId: string | null   = null;
    activeTab: 'chart' | 'residuals' | 'formula' = 'chart';
    dropdownOpen  = false;

    private priceChart: Chart | null = null;
    private residChart: Chart | null = null;

    constructor(private cdr: ChangeDetectorRef) {}

    // ── Lifecycle ──

    ngOnInit(): void {
        for (const mk of Object.keys(MODELS))
            for (const p of MODELS[mk].params)
                this.paramVals[`${mk}_${p.id}`] = p.val;
        this.actual = generateActual(SIM_N);
        this.runSimulation();
    }

    ngAfterViewInit(): void { this.renderCharts(); }

    ngOnDestroy(): void {
        this.priceChart?.destroy();
        this.residChart?.destroy();
    }

    // ── Getters ──

    get cfg(): ModelDef { return MODELS[this.modelKey]; }

    get theilColor(): string {
        if (!this.stats) return 'var(--text)';
        return this.stats.theilU < 0.5 ? 'rgba(0,229,160,0.9)' : this.stats.theilU < 1 ? '#fbbf24' : '#f87171';
    }

    get theilLabel(): string {
        if (!this.stats) return '';
        return this.stats.theilU < 0.5 ? 'Excellent' : this.stats.theilU < 1 ? 'Good' : 'Weak';
    }

    get priceLast(): number  { return this.actual[this.actual.length - 1] ?? 100; }
    get priceDelta(): number { return ((this.priceLast - (this.actual[0] ?? 100)) / (this.actual[0] ?? 100)) * 100; }

    get statsRows(): { label: string; value: string; color: string }[] {
        const s = this.stats;
        return [
            { label: 'Theil U',    value: s ? s.theilU.toFixed(4)             : '—', color: this.theilColor },
            { label: 'RMSE',       value: s ? s.rmse.toFixed(3)                : '—', color: 'var(--accent-bright)' },
            { label: 'Naive RMSE', value: s ? s.naiveRmse.toFixed(3)           : '—', color: 'var(--muted)' },
            { label: 'Dir. acc.',  value: s ? `${s.dirAcc.toFixed(1)}%`        : '—', color: '#c4adff' },
            { label: 'Bias U^M',   value: s ? `${(s.uBias * 100).toFixed(1)}%` : '—', color: '#f87171' },
            { label: 'Var  U^S',   value: s ? `${(s.uVar  * 100).toFixed(1)}%` : '—', color: '#fbbf24' },
            { label: 'Cov  U^C',   value: s ? `${(s.uCov  * 100).toFixed(1)}%` : '—', color: 'rgba(0,229,160,0.9)' },
        ];
    }

    // ── Template helpers ──

    clamp(val: number): number { return Math.min(Math.max(val, 0), 100); }

    formatVal(param: ModelParam): string {
        const v = this.paramVals[`${this.modelKey}_${param.id}`] ?? param.val;
        return param.dec === 0 ? Math.round(v).toString() : v.toFixed(param.dec);
    }

    sliderBg(param: ModelParam): string {
        const v   = this.paramVals[`${this.modelKey}_${param.id}`] ?? param.val;
        const pct = ((v - param.min) / (param.max - param.min)) * 100;
        return `linear-gradient(90deg, var(--accent) ${pct}%, rgba(255,255,255,0.07) ${pct}%)`;
    }

    setTab(tab: 'chart' | 'residuals' | 'formula'): void {
        this.activeTab = tab;
        setTimeout(() => this.renderCharts(), 0);
    }

    // ── Actions ──

    selectModel(key: string): void {
        this.modelKey    = key;
        this.dropdownOpen = false;
        this.runSimulation();
    }

    onParamChange(param: ModelParam, event: Event): void {
        const val = parseFloat((event.target as HTMLInputElement).value);
        this.paramVals[`${this.modelKey}_${param.id}`] = val;
        this.runSimulation();
    }

    estimate(param: ModelParam): void {
        if (!param.est) return;
        this.estimatingId = param.id;
        this.cdr.markForCheck();
        setTimeout(() => {
            const est = runEstimator(param.est!, this.actual);
            if (est !== null) {
                this.paramVals[`${this.modelKey}_${param.id}`] = est;
                this.runSimulation();
            }
            this.estimatingId = null;
            this.cdr.markForCheck();
        }, 320);
    }

    randomize(): void {
        this.actual = generateActual(SIM_N);
        this.runSimulation();
    }

    runSimulation(): void {
        const p: Record<string, number> = {};
        for (const param of this.cfg.params)
            p[param.id] = this.paramVals[`${this.modelKey}_${param.id}`] ?? param.val;
        this.result = computeForecast(this.modelKey, p, this.actual);
        this.stats  = computeStats(this.actual, this.result.forecast);
        this.cdr.markForCheck();
        setTimeout(() => this.renderCharts(), 0);
    }

    // ── Charts ──

    private renderCharts(): void {
        if (this.activeTab === 'chart')     this.renderPriceChart();
        if (this.activeTab === 'residuals') this.renderResidChart();
    }

    private renderPriceChart(): void {
        const canvas = this.priceCanvasRef?.nativeElement;
        if (!canvas || !this.result) return;
        this.priceChart?.destroy();

        const labels    = Array.from({ length: SIM_N }, (_, i) => `t${i}`);
        const naive     = [this.actual[0], ...this.actual.slice(0, SIM_N - 1)];
        const gridColor = 'rgba(100,140,255,0.07)';
        const tickColor = 'rgba(170,185,240,0.45)';

        // @ts-ignore
        const cfg: ChartConfiguration = {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'Upper band', data: this.result.upper, borderWidth: 0,
                        backgroundColor: 'rgba(100,140,255,0.07)', fill: '+1', pointRadius: 0, tension: 0.3, order: 5 },
                    { label: 'Lower band', data: this.result.lower, borderWidth: 0,
                        fill: false, pointRadius: 0, tension: 0.3, order: 6 },
                    { label: 'Naive', data: naive, borderColor: 'rgba(120,140,200,0.3)',
                        borderWidth: 1.5, borderDash: [4, 4], fill: false, pointRadius: 0, tension: 0, order: 4 },
                    { label: 'Forecast', data: this.result.forecast, borderColor: '#f87171',
                        borderWidth: 2, fill: false, pointRadius: 0, tension: 0.3, order: 2 },
                    { label: 'Actual', data: this.actual, borderColor: 'var(--accent-bright)',
                        borderWidth: 2.5, backgroundColor: 'rgba(100,140,255,0.07)',
                        fill: true, pointRadius: 0, tension: 0.3, order: 1 },
                ],
            },
            options: {
                responsive: true, maintainAspectRatio: false, animation: { duration: 350 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index', intersect: false,
                        backgroundColor: 'rgba(8,12,38,0.95)',
                        borderColor: 'rgba(100,140,255,0.25)', borderWidth: 1,
                        titleColor: tickColor, bodyColor: '#dde6ff',
                        callbacks: { label: (ctx: TooltipItem<'line'>) => ` ${ctx.dataset.label}: $${(ctx.raw as number).toFixed(2)}` },
                    },
                },
                scales: {
                    x: { ticks: { color: tickColor, font: { size: 10 }, maxTicksLimit: 10 }, grid: { color: gridColor } },
                    y: { ticks: { color: tickColor, font: { size: 10 },
                            callback: (v: number | string) => `$${(v as number).toFixed(0)}` },
                        grid: { color: gridColor } },
                },
            },
        };

        this.priceChart = new Chart(canvas, cfg);
    }

    private renderResidChart(): void {
        const canvas = this.residCanvasRef?.nativeElement;
        if (!canvas || !this.stats) return;
        this.residChart?.destroy();

        const labels    = Array.from({ length: SIM_N }, (_, i) => `t${i}`);
        const errors    = this.stats.errors;
        const gridColor = 'rgba(100,140,255,0.07)';
        const tickColor = 'rgba(170,185,240,0.45)';

        const cfg: ChartConfiguration = {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Residual', data: errors,
                    backgroundColor: errors.map(e => e >= 0 ? 'rgba(0,229,160,0.6)' : 'rgba(248,113,113,0.6)'),
                    borderWidth: 0, borderRadius: 2,
                }],
            },
            options: {
                responsive: true, maintainAspectRatio: false, animation: { duration: 350 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(8,12,38,0.95)',
                        borderColor: 'rgba(100,140,255,0.25)', borderWidth: 1,
                        titleColor: tickColor, bodyColor: '#dde6ff',
                        callbacks: { label: (ctx: TooltipItem<'bar'>) => ` Residual: ${(ctx.raw as number).toFixed(2)}` },
                    },
                },
                scales: {
                    x: { ticks: { color: tickColor, font: { size: 10 }, maxTicksLimit: 10 }, grid: { display: false } },
                    y: { ticks: { color: tickColor, font: { size: 10 },
                            callback: (v: number | string) => (v as number).toFixed(1) },
                        grid: { color: gridColor } },
                },
            },
        };

        this.residChart = new Chart(canvas, cfg);
    }
}
import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
    selector: 'app-aboutus',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent, NgOptimizedImage],
    template: `
        <div class="bg2"></div>

        <app-navbar></app-navbar>

        <main class="about">

            <section class="hero">
                <div class="hero-inner">
                    <div class="hero-tag">ABOUT US</div>

                    <h1>
                        Building <span class="g">Intelligent Systems</span><br />
                        With Clarity & Precision
                    </h1>

                    <p class="hero-lead">
                        We architect scalable digital infrastructure where artificial intelligence,
                        resilient cloud systems and disciplined engineering converge to deliver
                        measurable and sustainable value. Our focus is not simply on deploying
                        technology, but on designing structured ecosystems that enhance decision-making,
                        streamline operations and create long-term strategic advantage across evolving markets.
                    </p>

                    <p class="hero-sub">
                        Through thoughtful architecture and deliberate execution, we transform
                        complexity into structured intelligence, ensuring that every platform
                        we build remains adaptable, secure and aligned with real business objectives.
                    </p>
                </div>
            </section>

            <section class="section narrow">
                <div class="section-head">
                    <div class="sec-badge"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-goal-icon lucide-goal"><path d="M12 13V2l8 4-8 4"/><path d="M20.561 10.222a9 9 0 1 1-12.55-5.29"/><path d="M8.002 9.997a5 5 0 1 0 8.9 2.02"/></svg></div>
                    <h2>Our Mission</h2>
                </div>

                <p class="section-text"> 
                    Our mission is to engineer intelligent systems that operate with precision,
                    resilience and long-term adaptability. We believe technology should amplify
                    human capability rather than introduce unnecessary friction. Every solution
                    we design is guided by structured thinking, data-driven insights and a
                    commitment to operational excellence.
                </p>

                <p class="section-text">
                    From early-stage innovation to enterprise-grade deployment, we prioritize
                    architectural clarity, performance optimization and security by design.
                    Our mission extends beyond delivery — it encompasses continuous refinement,
                    strategic scalability and the creation of digital environments capable of
                    evolving alongside the organizations they support.
                </p>
            </section>

            <section class="section split">
                <div class="split-text">
                    <div class="sec-badge"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <h2>Introducing OrionCoin</h2>

                    <p>
                        OrionCoin is an innovative digital asset developed as part of the OrionTrade ecosystem, reflecting the platform’s commitment to exploring next-generation financial technologies. Introduced as a strategic innovation, it extends the capabilities of OrionTrade by integrating cryptocurrency-based value exchange into its infrastructure
                    </p>

                    <p>
                        Within the platform, OrionCoin is designed to facilitate internal transactions, support platform incentives and enable new digital interactions between users and services. By incorporating a native cryptocurrency, OrionTrade opens the door to future decentralized features and more flexible economic models.                    </p>
                    <p>Through OrionTrade, OrionTrade continues to evolve beyond the traditional brokerage framework, positioning itself at the intersection of digital assets, intelligent financial systems and modern trading platforms.</p>
                    <button class="cta-btn">For more</button>
                </div>
                 
                <div class="split-media">
                    <img ngSrc="assets/Logo1.png" width="380" height="380" alt="Logo">
                </div>
            </section>

            <section class="section narrow">
                <div class="section-head">
                    <div class="sec-badge"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gem-icon lucide-gem"><path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/></svg></div>
                    <h2>Core Principles</h2>
                </div>

                <div class="principles">
                    <div class="principle">
                        <h4>Clarity</h4>
                        <p>
                            We prioritize structured thinking and transparent execution.
                            Clear architectural foundations lead to scalable systems,
                            reduced complexity and sustainable innovation.
                        </p>
                    </div>

                    <div class="principle">
                        <h4>Resilience</h4>
                        <p>
                            Our systems are engineered to withstand volatility and evolve
                            alongside dynamic market conditions. Adaptability is embedded
                            into every design decision we make.
                        </p>
                    </div>

                    <div class="principle">
                        <h4>Impact</h4>
                        <p>
                            Technology must produce measurable value. We focus on
                            performance, operational efficiency and strategic outcomes
                            rather than surface-level metrics.
                        </p>
                    </div>
                </div>
            </section>

            <section class="cta">
                <h2>Let’s Build the Future Together</h2>
                <p>
                    If you are seeking intelligent digital systems designed for clarity,
                    scalability and measurable impact, we are ready to collaborate and
                    engineer the infrastructure that will support your next stage of growth.
                </p>
                <button class="btn-primary">Start a Conversation →</button>
            </section>

            <footer>
                <div class="flogo">OrionTrade</div>
                <div class="fcopy">© 2026 OrionTrade</div>
            </footer>

        </main>
    `,
    styles: [`
        .about {
            padding-top: 140px;
        }

        .hero {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 120px 0;
        }

        .hero-inner {
            max-width: 820px;
        }

        .hero h1 {
            font-size: clamp(2.4rem, 4vw, 3.6rem);
            line-height: 1.1;
            margin-bottom: 28px;
        }

        .hero-lead {
            font-size: 1.05rem;
            color: var(--muted);
            line-height: 1.9;
            margin-bottom: 22px;
        }

        .hero-sub {
            font-size: .95rem;
            color: var(--dim);
            line-height: 1.8;
        }

        .section {
            padding: 120px 0;
        }

        .narrow {
            max-width: 820px;
            margin: 0 auto;
            text-align: center;
        }

        .section-head {
            margin-bottom: 40px;
        }

        .section-text {
            color: var(--muted);
            line-height: 1.9;
            margin-bottom: 24px;
        }

        .split {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            align-items: center;
            max-width: 1100px;
            margin: 0 auto;
        }

        .split-text p {
            color: var(--muted);
            line-height: 1.9;
            margin-bottom: 22px;
        }

        .split-media {
            display: flex;
            justify-content: center;

            border-color: rgba(120, 255, 120, 0.6);
        }

        .split-media img {
            max-width: 380px;
            width: 100%;
            border: 2px solid rgba(170, 255, 200, 0.85);;
            border-radius: 22px;
            box-shadow: 0 50px 50px rgba(92, 205, 173, 0.9);
        }

        .principles {
            display: grid;
            gap: 40px;
            margin-top: 40px;
        }

        .principle h4 {
            margin-bottom: 10px;
        }

        .principle p {
            color: var(--muted);
            line-height: 1.8;
        }

        .cta {
            text-align: center;
            padding: 140px 0;
            max-width: 760px;
            margin: 0 auto;
        }

        .cta p {
            color: var(--muted);
            line-height: 1.9;
            margin-bottom: 32px;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--blue), var(--purple));
            border: none;
            color: #fff;
            padding: 14px 36px;
            border-radius: 14px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 10px 40px rgba(61, 90, 255, .35);
            transition: .3s;
        }

        .btn-primary:hover {
            transform: translateY(-3px);
        }

        footer {
            margin-top: 80px;
            padding: 40px 0;
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
        }

        @media (max-width: 900px) {
            .split {
                grid-template-columns: 1fr;
                text-align: center;
            }

            footer {
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }
        }
    `]
})
export class AboutUsComponent {}
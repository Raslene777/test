import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <div class="bg"></div>
    <div class="bg-halo"></div>

    <app-navbar />

    <main>
      <section class="hero">
        <div class="hero-tag">AI-Powered Trading Platform</div>
        <h1>Welcome, how can<br /><span class="g">we help you today?</span></h1>

        <div class="search-wrapper">
          <div class="search-container">
            <span class="s-left"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-sparkles-icon lucide-sparkles"
              >
                <path
                  d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
                />
                <path d="M20 2v4" />
                <path d="M22 4h-4" />
                <circle cx="4" cy="20" r="2" /></svg
            ></span>
            <input
              class="search-box"
              type="text"
              placeholder="Ask Orion what you want…"
            />
            <div class="s-right">
              <div class="s-btn" title="Send">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-send-icon lucide-send"
                >
                  <path
                    d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
                  />
                  <path d="m21.854 2.147-10.94 10.939" />
                </svg>
              </div>
              <div class="s-btn" title="files">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-paperclip-icon lucide-paperclip"
                >
                  <path
                    d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="chips">
            <div class="chip">📈 Latest stock market news</div>
            <div class="chip">💹 Best trading options rn</div>
            <div class="chip">🚀 How to start with OrionTrade</div>
          </div>
        </div>
      </section>

      <div class="divider"></div>

      <section class="sec">
        <div class="sec-head">
          <div class="sec-badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-gem-icon lucide-gem"
            >
              <path d="M10.5 3 8 9l4 13 4-13-2.5-6" />
              <path
                d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"
              />
              <path d="M2 9h20" />
            </svg>
          </div>
          <h2>Discover Goblin Pro</h2>
          <p>
            Real-time data, AI-powered insights, and professional tools built
            for traders who mean business.
          </p>
        </div>
        <div class="grid3">
          <div class="fcard">
            <div class="ficon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-chart-candlestick-icon lucide-chart-candlestick"
              >
                <path d="M9 5v4" />
                <rect width="4" height="6" x="7" y="9" rx="1" />
                <path d="M9 15v2" />
                <path d="M17 3v2" />
                <rect width="4" height="8" x="15" y="5" rx="1" />
                <path d="M17 13v3" />
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              </svg>
            </div>
            <h3>Real-Time Market Data</h3>
            <p>
              Live price feeds, order book depth, and tick-by-tick data streamed
              directly to your dashboard with sub-millisecond latency.
            </p>
          </div>
          <div class="fcard">
            <div class="ficon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-bot-message-square-icon lucide-bot-message-square"
              >
                <path d="M12 6V2H8" />
                <path d="M15 11v2" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path
                  d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"
                />
                <path d="M9 11v2" />
              </svg>
            </div>
            <h3>AI-Powered Insights</h3>
            <p>
              Ask OrionCore anything about your portfolio, market conditions, or
              strategies. Get instant, data-backed answers 24/7.
            </p>
          </div>
          <div class="fcard">
            <div class="ficon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-shield-check-icon lucide-shield-check"
              >
                <path
                  d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3>Advanced Risk Management</h3>
            <p>
              Automatic stop-loss, position sizing guidance, and real-time P&L
              tracking to protect and grow your capital.
            </p>
          </div>
        </div>
      </section>

      <div class="divider"></div>

      <section class="sec">
        <div class="sec-head">
          <h2>Plans for Everyone</h2>
          <p>
            From first-time investors to professional desks — a plan built for
            every level.
          </p>
        </div>
        <div class="pgrid">
          <div class="pcard">
            <div class="pname">Starter</div>
            <div class="pprice"><sup>$</sup>0<sub>/mo</sub></div>
            <div class="pdesc">
              Perfect for exploring the markets. No credit card required.
            </div>
            <ul class="pfeats">
              <li>Up to 5 watchlists</li>
              <li>Delayed data (15 min)</li>
              <li>Basic charting tools</li>
              <li>Community access</li>
            </ul>
            <button class="pbtn pbtn-outline">Get Started Free</button>
          </div>
          <div class="pcard pro">
            <div class="pro-badge">Popular</div>
            <div class="pname">Pro</div>
            <div class="pprice"><sup>$</sup>29<sub>/mo</sub></div>
            <div class="pdesc">
              For active traders who need real-time data and full AI access.
            </div>
            <ul class="pfeats">
              <li>Unlimited watchlists</li>
              <li>Real-time market data</li>
              <li>Full OrionCore access</li>
              <li>Advanced order types</li>
              <li>Portfolio analytics</li>
            </ul>
            <button class="pbtn pbtn-fill">Purchase Pro</button>
          </div>
          <div class="pcard">
            <div class="pname">Business</div>
            <div class="pprice"><sup>$</sup>99<sub>/mo</sub></div>
            <div class="pdesc">
              For teams who need multi-seat access, APIs, and custom tools.
            </div>
            <ul class="pfeats">
              <li>Everything in Pro</li>
              <li>Up to 10 seats</li>
              <li>API access & webhooks</li>
              <li>Custom dashboards</li>
              <li>Priority support</li>
            </ul>
            <button class="pbtn pbtn-outline">Purchase Business</button>
          </div>
        </div>
      </section>

      <div class="divider"></div>

      <section class="sec">
        <div class="sec-head">
          <h2>Honest Reviews</h2>
          <p>Real traders, real results — here's what they say.</p>
        </div>
        <div class="grid3">
          <div class="rcard">
            <div class="stars">★★★★★</div>
            <blockquote>
              "The AI assistant is genuinely impressive. Asked it to analyze my
              portfolio risk and it gave a detailed breakdown in seconds.
              Nothing else comes close."
            </blockquote>
            <div class="rauthor">
              <div class="ravatar">AK</div>
              <div>
                <div class="rname">Alex Kim</div>
                <div class="rrole">Day Trader · New York</div>
              </div>
            </div>
          </div>
          <div class="rcard">
            <div class="stars">★★★★★</div>
            <blockquote>
              "Switched from a legacy platform and the difference is night and
              day. Real-time data, clean UI, and the order book is best in
              class."
            </blockquote>
            <div class="rauthor">
              <div class="ravatar">SR</div>
              <div>
                <div class="rname">Sara R.</div>
                <div class="rrole">Swing Trader · London</div>
              </div>
            </div>
          </div>
          <div class="rcard">
            <div class="stars">★★★★☆</div>
            <blockquote>
              "The Business plan is worth every cent. Multi-seat access and the
              API integration saved our team countless hours of manual work
              every week."
            </blockquote>
            <div class="rauthor">
              <div class="ravatar">MO</div>
              <div>
                <div class="rname">Marcus O.</div>
                <div class="rrole">Fund Manager · Dubai</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="divider"></div>

      <section class="cta-sec">
        <div class="cta-halo"></div>
        <h2>Why Choose Orion?</h2>
        <p>
          Join thousands of traders who trust Orion for smarter,<br />faster,
          and more confident trading decisions.
        </p>
        <button class="cta-btn" routerLink="/register">
          Get Started Today <span class="cta-arrow">→</span>
        </button>
      </section>
    </main>

    <footer>
      <div class="flogo">OrionTrade © 2026</div>
      <ul class="flinks">
        <li><a href="#">Privacy</a></li>
        <li><a href="#">Terms</a></li>
        <li><a href="#">Support</a></li>
        <li><a href="#">Status</a></li>
      </ul>
      <div class="fcopy">Built for traders, by traders.</div>
    </footer>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class LandingComponent {}

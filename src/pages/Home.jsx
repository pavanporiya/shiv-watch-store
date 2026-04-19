import { useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal";
import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";

export default function Home() {
  const navigate = useNavigate();

  const slides = [
    "https://images.pexels.com/photos/29902786/pexels-photo-29902786.jpeg",
    "https://images.pexels.com/photos/36174613/pexels-photo-36174613.jpeg",
    "https://images.unsplash.com/photo-1547996160-81dfa63595aa",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageWrapper>
      <div>

        {/* HERO */}
        <section
          className="hero"
          style={{ backgroundImage: `url(${slides[index]})` }}
        >
          <div className="hero-content">
            <h1>Time Redefined</h1>
            <p>Crafted for those who value precision</p>
            <button className="hero-btn" onClick={() => navigate("/shop")}>
              Explore Collection
            </button>
          </div>
        </section>

        {/* STATS */}
        <Reveal>
          <section className="stats">
            <div><h3>10K+</h3><p>Customers</p></div>
            <div><h3>50+</h3><p>Models</p></div>
            <div><h3>5 Years</h3><p>Crafting Excellence</p></div>
          </section>
        </Reveal>

        {/* ABOUT BRAND */}
        <Reveal>
          <section className="section">
            <div className="container">
            <h2>About Shiv Watch</h2>
            <p className="about-text">
              At Shiv Watch, we believe time is more than just numbers — it's an expression of identity.
              Our watches are crafted with precision, elegance, and innovation to match modern lifestyles.
              From luxury pieces to everyday essentials, we redefine timekeeping with style.
            </p>
            </div>
          </section>
        </Reveal>

        {/* FEATURED */}
        <Reveal>
          <section className="section dark">
            <h2>Featured Collection</h2>
            <div className="featured-grid">
              <div className="featured-card" onClick={() => navigate("/shop")}>
                <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314" />
                <div className="overlay"><h3>Luxury Series</h3></div>
              </div>

              <div className="featured-card" onClick={() => navigate("/shop")}>
                <img src="https://images.unsplash.com/photo-1622434641406-a158123450f9" />
                <div className="overlay"><h3>Sport Series</h3></div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ACHIEVEMENTS */}
        <Reveal>
          <section className="section">
            <div className="container"> 
            <h2>Our Achievements</h2>
            <div className="achievements">
              <div><h3>10K+</h3><p>Happy Customers</p></div>
              <div><h3>25+</h3><p>Countries Served</p></div>
              <div><h3>4.8★</h3><p>Average Rating</p></div>
            </div>
            </div>
          </section>
        </Reveal>

        {/* WHY US */}
        <Reveal>
          <section className="section dark">
            <h2>Why Choose Us</h2>
            <div className="why-grid">
              <div><h4>Premium Quality</h4><p>Top-grade materials used in every watch</p></div>
              <div><h4>Fast Delivery</h4><p>Quick and reliable worldwide shipping</p></div>
              <div><h4>Secure Payments</h4><p>100% safe and trusted checkout</p></div>
            </div>
          </section>
        </Reveal>

        {/* TRUST */}
        <Reveal>
          <section className="trusted">
            <h2>Trusted By</h2>
            <div className="trusted-logos">
              <span>ROLEX</span>
              <span>TITAN</span>
              <span>FOSSIL</span>
              <span>CASIO</span>
              <span>SEIKO</span>
            </div>
          </section>
        </Reveal>

        {/* AVAILABILITY */}
        <Reveal>
          <section className="availability">
            <h2>Worldwide Delivery</h2>
            <p>Available in 25+ countries with fast shipping</p>
          </section>
        </Reveal>

        {/* FOOTER (UPGRADED) */}
        <footer className="footer">
          <div className="footer-grid">

            <div>
              <h3>Shiv Watch</h3>
              <p>Premium watches crafted for modern lifestyle.</p>
            </div>

            <div>
              <h4>Quick Links</h4>
              <p>Home</p>
              <p>Shop</p>
              <p>Orders</p>
            </div>

            <div>
              <h4>Contact</h4>
              <p>Email: support@shivwatch.com</p>
              <p>Phone: +91 9876543210</p>
              <p>Ahmedabad, India</p>
            </div>

          </div>

          <p className="copyright">
            © 2026 Shiv Watch. All rights reserved.
          </p>
        </footer>

      </div>
    </PageWrapper>
  );
}
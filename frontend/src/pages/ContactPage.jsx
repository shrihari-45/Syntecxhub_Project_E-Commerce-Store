import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Headphones } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Your message has been sent to ShopHub support! We will reply within 24 hours.', 'success');
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container" style={{ margin: '3rem auto 6rem', maxWidth: 980 }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.65rem' }}>
          Contact & Support
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto' }}>
          Have questions regarding an order, product inquiries, or internship feedback? Reach out to our team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Email Support</h4>
                <div style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>support@shophub.com</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Direct technical and order inquiries. Average response time: under 4 hours.
            </p>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: '#ede9fe', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Headphones size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Telephone Helpline</h4>
                <div style={{ color: 'var(--accent-purple)', fontSize: '0.9rem', fontWeight: 600 }}>+1 (800) 555-0199</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Available Monday through Friday, 9:00 AM – 6:00 PM EST.
            </p>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: '#ecfdf5', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Office Headquarters</h4>
                <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>San Francisco, CA</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ShopHub Technology & Innovation Campus.
            </p>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} style={{ color: 'var(--primary)' }} />
            <span>Send Us a Message</span>
          </h3>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
              <h4 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Message Dispatched!</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                Thank you for getting in touch. One of our support representatives will get back to you shortly.
              </p>
              <button
                className="btn-primary"
                style={{ background: 'var(--primary)', color: 'white', padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  placeholder="How can we assist you?"
                  className="form-input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide any details, order IDs, or queries..."
                  className="form-input"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn-checkout"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                <Send size={16} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

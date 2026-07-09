import Button from '../components/ui/Button.jsx';
import KumkumDivider from '../components/ui/KumkumDivider.jsx';
import './ComingSoon.css';

/**
 * ComingSoon — shown for any nav destination the current phase hasn't
 * built yet (Academy, Gallery, Testimonials, Offers, Contact). Beats a
 * blank page or a broken link while the phased build is in progress.
 */
export default function ComingSoon({ title, phaseLabel }) {
  return (
    <section className="coming-soon container">
      <p className="eyebrow">{phaseLabel}</p>
      <h1>{title}</h1>
      <KumkumDivider align="center" />
      <p className="coming-soon__note">
        This page is being built in an upcoming phase of the project. In the meantime, head back
        home or book an appointment directly.
      </p>
      <div className="coming-soon__actions">
        <Button variant="primary" size="lg" href="#/">Back to Home</Button>
        <Button variant="secondary" size="lg" href="#/book">Book an Appointment</Button>
      </div>
    </section>
  );
}

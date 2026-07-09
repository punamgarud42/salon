import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import SalonIcon from '../ui/SalonIcon.jsx';
import { getCategoryGradient } from '../../lib/categoryTheme.js';
import { downloadTextFile, buildCourseBrochure } from '../../lib/download.js';
import { useLanguage } from '../../context/LanguageContext';
import './CourseCard.css';

export default function CourseCard({ course }) {
  const { t } = useLanguage();
  const [c1, c2] = getCategoryGradient(course.category);

  function handleBrochure() {
    downloadTextFile(`${course.name.replace(/\s+/g, '-')}-brochure.txt`, buildCourseBrochure(course));
  }

  return (
    <Card className="course-card">
      <div className="course-card__swatch" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
        <SalonIcon name={course.icon} size={36} className="course-card__icon" />
        <span className="course-card__category">{course.category}</span>
      </div>

      <h3 className="course-card__name">{course.name}</h3>
      <p className="course-card__desc">{course.description}</p>

      <div className="course-card__meta">
        <div>
          <span className="course-card__meta-label">Duration</span>
          <span className="course-card__meta-value">{course.duration}</span>
        </div>
        <div>
          <span className="course-card__meta-label">Mode</span>
          <span className="course-card__meta-value">{course.mode}</span>
        </div>
        <div>
          <span className="course-card__meta-label">Fee</span>
          <span className="course-card__meta-value course-card__fee">₹{course.fee.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="course-card__actions">
        <Button variant="secondary" size="md" onClick={handleBrochure}>{t('academyPage.downloadBrochure')}</Button>
        <Button variant="primary" size="md" href={`#/enroll?course=${course.id}`}>{t('academyPage.applyNow')}</Button>
      </div>
    </Card>
  );
}

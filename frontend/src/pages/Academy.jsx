import { useState } from 'react';
import CourseCard from '../components/academy/CourseCard.jsx';
import BatchCalendar from '../components/academy/BatchCalendar.jsx';
import KumkumDivider from '../components/ui/KumkumDivider.jsx';
import FilterTabs from '../components/ui/FilterTabs.jsx';
import Reveal from '../components/home/Reveal.jsx';
import { useBackedList } from '../hooks/useBackedList.js';
import { DEFAULT_COURSES, extractCourseCategories } from '../data/courses.js';
import { useBatchAvailability } from '../hooks/useBatchAvailability.js';
import { useLanguage } from '../context/LanguageContext';
import './Academy.css';

export default function Academy() {
  const { t } = useLanguage();
  const { items: allCourses, loading } = useBackedList('/courses', DEFAULT_COURSES);
  const categories = extractCourseCategories(allCourses);
  const [activeCategory, setActiveCategory] = useState('All');
  const { batches, loading: batchesLoading } = useBatchAvailability();

  const filtered = activeCategory === 'All'
    ? allCourses
    : allCourses.filter((c) => c.category === activeCategory);

  return (
    <>
      <section className="academy-page container">
        <Reveal direction="up">
          <p className="eyebrow">{t('academyPage.eyebrow')}</p>
          <h1>{t('academyPage.heading')}</h1>
          <KumkumDivider align="left" />
          <p className="academy-page__lede">
            {t('academyPage.lede')}
          </p>
        </Reveal>

        {!loading && (
          <Reveal direction="up" delay={80}>
            <FilterTabs categories={categories} active={activeCategory} onChange={setActiveCategory} allLabel={t('academyPage.allCourses')} />
          </Reveal>
        )}

        {loading ? (
          <p className="academy-page__lede">Loading courses…</p>
        ) : (
          <div className="academy-page__grid">
            {filtered.map((course, i) => (
              <Reveal direction="up" delay={i * 70} key={course.id}>
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="academy-page__batches-section">
        <div className="container">
          <Reveal direction="up">
            <p className="eyebrow">{t('academyPage.batchEyebrow')}</p>
            <h2>{t('academyPage.batchHeading')}</h2>
            <KumkumDivider align="left" />
            <p className="academy-page__lede">
              {t('academyPage.batchLede')}
            </p>
          </Reveal>

          <Reveal direction="up" delay={80}>
            <BatchCalendar batches={batches} loading={batchesLoading} />
          </Reveal>
        </div>
      </section>
    </>
  );
}

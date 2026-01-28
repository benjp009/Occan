import React from 'react';
import { Link } from 'react-router-dom';
import { CompanyRow } from '../types';
import { OptimizedImage, getLocalAssetPaths } from '../utils/imageUtils';
import { slugify } from '../utils/slugify';
import { sanitizeHTML } from '../utils/sanitize';

interface CompanyProps {
  company: CompanyRow;
}

const Company: React.FC<CompanyProps> = ({ company }) => {
  const showLong = company.long_content?.toLowerCase() === 'yes';
  const firstCategory = company.categories?.split(',')[0]?.trim();

  // Format location from available fields
  const location = [company.hq_city, company.hq_country]
    .filter(Boolean)
    .join(', ');

  return (
    <article className="software-page" itemScope itemType="https://schema.org/SoftwareApplication">
      {/* Hero Section */}
      <section className="software-hero">
        <div className="software-hero__main">
          <div className="software-hero__identity">
            {company.logo && (
              <div className="software-hero__logo-wrapper">
                <OptimizedImage
                  src={company.logo}
                  alt={`Logo ${company.name}`}
                  className="software-hero__logo"
                  itemProp="image"
                  fallbackSrcs={getLocalAssetPaths(company.name, 'logo')}
                />
              </div>
            )}
            <div className="software-hero__title-group">
              <h1 className="software-hero__name" itemProp="name">{company.name}</h1>
              <div className="software-hero__badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
                <span>Made in France</span>
              </div>
            </div>
          </div>

          <div className="software-hero__actions">
            {company.website && (
              <a
                href={`/refer/${slugify(company.name)}`}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="software-hero__cta-primary"
                itemProp="url"
              >
                <span>Visiter {company.name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )}
            <div className="software-hero__secondary-actions">
              {company.email && (
                <a href={`mailto:${company.email}`} className="software-hero__link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>E-mail</span>
                </a>
              )}
              {company.phone && (
                <a href={`tel:${company.phone}`} className="software-hero__link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2137 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5342 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30512 3.09849 2.44756 2.85669 2.63477 2.65162C2.82198 2.44655 3.05 2.28271 3.30379 2.17052C3.55759 2.05833 3.8315 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.11 3.72C9.23662 4.68007 9.47144 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1859 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Appeler</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="software-info-bar">
        {firstCategory && (
          <Link to={`/categorie/${slugify(firstCategory)}`} className="software-info-bar__item software-info-bar__item--category">
            <span className="software-info-bar__label">Categorie</span>
            <span className="software-info-bar__value">{firstCategory}</span>
          </Link>
        )}

        {company.siret && (
          <div className="software-info-bar__item">
            <span className="software-info-bar__label">SIRET</span>
            {company.pappers ? (
              <a
                href={company.pappers}
                target="_blank"
                rel="noopener noreferrer"
                className="software-info-bar__value software-info-bar__link"
              >
                {company.siret}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ) : (
              <span className="software-info-bar__value">{company.siret}</span>
            )}
          </div>
        )}

        {company.revenue2023 && (
          <div className="software-info-bar__item">
            <span className="software-info-bar__label">Chiffre d'affaires 2023</span>
            <span className="software-info-bar__value">{company.revenue2023}</span>
          </div>
        )}

        {location && (
          <div className="software-info-bar__item">
            <span className="software-info-bar__label">Localisation</span>
            <span className="software-info-bar__value">{location}</span>
          </div>
        )}
      </section>

      {/* Description Section */}
      <section className="software-content">
        {showLong ? (
          <div className="software-content__long">
            {company.description_1 && (
              <div className="software-content__block">
                <div
                  className="software-content__text"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(company.description_1) }}
                />
                {company.asset_1 && (
                  <div className="software-content__media">
                    <OptimizedImage
                      src={company.asset_1}
                      alt={`${company.name} - Illustration 1`}
                      className="software-content__image"
                      fallbackSrcs={getLocalAssetPaths(company.name, 'asset_1')}
                    />
                  </div>
                )}
              </div>
            )}

            {company.description_2 && (
              <div className="software-content__block software-content__block--reverse">
                {company.asset_2 && (
                  <div className="software-content__media">
                    <OptimizedImage
                      src={company.asset_2}
                      alt={`${company.name} - Illustration 2`}
                      className="software-content__image"
                      fallbackSrcs={getLocalAssetPaths(company.name, 'asset_2')}
                    />
                  </div>
                )}
                <div
                  className="software-content__text"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(company.description_2) }}
                />
              </div>
            )}

            {company.description_3 && (
              <div className="software-content__block">
                <div
                  className="software-content__text"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(company.description_3) }}
                />
                {company.asset_3 && (
                  <div className="software-content__media">
                    <OptimizedImage
                      src={company.asset_3}
                      alt={`${company.name} - Illustration 3`}
                      className="software-content__image"
                      fallbackSrcs={getLocalAssetPaths(company.name, 'asset_3')}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="software-content__short">
            <h2 className="software-content__heading">A propos de {company.name}</h2>
            <div
              className="software-content__description"
              itemProp="description"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(company.description) }}
            />
          </div>
        )}
      </section>

      {/* Trust Signals Section */}
      <section className="software-trust">
        <h2 className="software-trust__heading">Pourquoi choisir {company.name} ?</h2>
        <div className="software-trust__grid">
          <div className="software-trust__card">
            <div className="software-trust__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="software-trust__title">Made in France</h3>
            <p className="software-trust__text">Solution developpee et hebergee en France, garantissant la conformite RGPD et la souverainete des donnees.</p>
          </div>

          {firstCategory && (
            <div className="software-trust__card">
              <div className="software-trust__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="software-trust__title">Expert {firstCategory}</h3>
              <p className="software-trust__text">Specialiste reconnu dans le domaine {firstCategory.toLowerCase()}, avec une expertise metier approfondie.</p>
            </div>
          )}

          {company.siret && (
            <div className="software-trust__card">
              <div className="software-trust__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 21V7L12 3L19 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 21V15H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="software-trust__title">Entreprise verifiee</h3>
              <p className="software-trust__text">Societe francaise immatriculee, avec un SIRET valide et des informations legales transparentes.</p>
            </div>
          )}
        </div>
      </section>

      {/* Keywords/Tags Section */}
      {company.keywords && (
        <section className="software-tags">
          <h3 className="software-tags__heading">Mots-cles</h3>
          <div className="software-tags__list">
            {company.keywords.split(',').map((keyword, index) => (
              <span key={index} className="software-tags__tag">
                {keyword.trim()}
              </span>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export default Company;

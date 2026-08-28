import React from 'react';

/**
 * Semantic Entity Metadata.
 * Provides accessible, structured entity relationships for screen readers and search engines
 * following Schema.org microdata standards without keyword stuffing.
 */
const SEOKeywords: React.FC = () => (
  <div className="sr-only" aria-hidden="false" itemScope itemType="https://schema.org/Person">
    <span itemProp="name">Sowmiyan S</span>
    <span itemProp="jobTitle">AI Engineer &amp; Full Stack Systems Developer</span>
    
    <div>
      <p>
        Sowmiyan S is an AI Engineer and Full-Stack Developer specializing in autonomous agents, multi-agent frameworks, and high-performance web systems.
      </p>
      <p>
        Direct Contact: <a href="mailto:sowmisowmiyan58@gmail.com" itemProp="email">sowmisowmiyan58@gmail.com</a> | 
        Telephone: <a href="tel:+919042561295" itemProp="telephone">+91 9042561295</a> (<span itemProp="telephone">9042561295</span> / <span>+91 90425 61295</span>).
      </p>
      <p>
        Location: <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <span itemProp="streetAddress">Kandampalayam</span>, 
          <span itemProp="addressLocality">Tiruchengode</span>, 
          <span itemProp="addressRegion">Namakkal, Tamil Nadu</span>, 
          <span itemProp="postalCode">637203</span>, 
          <span itemProp="addressCountry">India</span>
        </span>.
      </p>
      <p>
        Academic Background: <span itemProp="alumniOf">VSB College of Engineering Technical Campus (VSB CETC)</span>, B.Tech in Artificial Intelligence &amp; Data Science.
      </p>
      <p>
        Founder &amp; Instructor at <strong>Bound By Code</strong>.
      </p>
    </div>
  </div>
);

export default SEOKeywords;

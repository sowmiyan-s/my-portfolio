import React from 'react';

/**
 * Screen-reader / crawler-only semantic content.
 * Injects target keywords directly into the DOM so crawlers pick them up
 * without altering the visual design.
 */
const SEOKeywords: React.FC = () => (
  <div className="sr-only" aria-hidden="false" itemScope itemType="https://schema.org/Person">
    <h1 itemProp="name">Sowmiyan S — AI Developer, Software Engineer &amp; Founder</h1>
    <h2 itemProp="jobTitle">AI Engineer · Full Stack Developer · Multi-Agent LLM Systems · Bound By Code</h2>
    
    <div>
      <p>
        Official website of <strong>Sowmiyan S</strong> (also known as <strong>sowmiyan-s</strong>, <strong>sowmiyan ai</strong>, <strong>sowmiyan developer</strong>, <strong>sowmiyan namakkal</strong>, <strong>sowmiyan s ai developer</strong>).
      </p>
      <p>
        Contact phone: <span itemProp="telephone">+91 9042561295</span> (9042561295). Email: <span itemProp="email">sowmisowmiyan58@gmail.com</span>.
      </p>
      <p>
        Location: <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <span itemProp="streetAddress">Kandampalayam</span>, 
          <span itemProp="addressLocality">Tiruchengode</span>, 
          <span itemProp="addressRegion">Namakkal</span>, 
          <span>Tamil Nadu</span> — 637203, <span>India</span>
        </span>.
      </p>
      <p>
        Education: <span itemProp="alumniOf">VSB College of Engineering Technical Campus (VSB CETC)</span>, B.Tech in Artificial Intelligence &amp; Data Science.
      </p>
      <p>
        Creator and Lead Instructor of <strong>Bound By Code</strong> — Tamil-language educational platform covering Artificial Intelligence, Large Language Models, Multi-Agent Systems (CrewAI, LangChain), Vibe Coding, and modern full-stack web engineering.
      </p>
      <p>
        Key Search Queries &amp; Profiles: Sowmiyan S, sowmiyan-s, sowmiyan ai, sowmiyan developer, sowmiyan namakkal, 9042561295, bound by code, sowmiyan s ai developer, sowmiyan tiruchengode, sowmiyan kandampalayam, sowmiyan vsb, sowmiyan portfolio.
      </p>
    </div>
  </div>
);

export default SEOKeywords;

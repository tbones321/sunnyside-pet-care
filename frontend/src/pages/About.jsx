import React from 'react'

export default function About() {
  return (
    <section style={{ maxWidth: 900 }}>
      <h2>Java Full Stack Developer</h2>
      <p>
        <strong>Phone:</strong> (925) 876-6278 &nbsp;&nbsp; <strong>Email:</strong> tony_filippo@yahoo.com
      </p>
      <p>Pacifica, CA • Authorized to work in the U.S.</p>

      <h3>Professional Summary</h3>
      <p>
        Java Full Stack Developer with 5+ years of experience designing and building scalable web applications using Java, Spring Boot, and modern frontend frameworks. Strong background in RESTful API development, full-stack integrations, and real-world product development. Experienced in translating business requirements into working software, with a focus on clean architecture, maintainability, and user experience.
      </p>

      <h3>Technical Skills</h3>
      <ul>
        <li><strong>Languages &amp; Runtimes:</strong> Java, JavaScript (ES6+), HTML5, CSS3</li>
        <li><strong>Frontend:</strong> React (functional components, hooks), Vite</li>
        <li><strong>Routing &amp; UI:</strong> react-router-dom, responsive layouts, CSS variables</li>
        <li><strong>Backend:</strong> Spring Boot (REST controllers, embedded Tomcat)</li>
        <li><strong>Build &amp; Package:</strong> Maven (backend), npm (frontend)</li>
        <li><strong>APIs &amp; Data:</strong> RESTful JSON endpoints</li>
        <li><strong>State &amp; Forms:</strong> React form handling, client-side validation</li>
        <li><strong>Styling &amp; Assets:</strong> Custom CSS, animations, Vite asset imports</li>
        <li><strong>Dev &amp; Scripting:</strong> PowerShell automation scripts, browser DevTools</li>
        <li><strong>Packaging &amp; Deployment:</strong> Executable Spring Boot JAR, logging &amp; config</li>
        <li><strong>Version Control:</strong> Git (feature-based workflow)</li>
      </ul>

      <h3>Experience</h3>

      <h4>Sunnyside Pet Care — Website Project</h4>
      <p><em>Full Stack Developer | July 2024 – Present</em></p>
      <ul>
        <li>Designed and developed a full-stack web application for a pet care business offering dog walking and pet sitting services</li>
        <li>Built dynamic React forms to collect client and pet information, service type, dates, and time windows with client-side validation</li>
        <li>Implemented RESTful APIs using Spring Boot to process service requests and handle backend business logic</li>
        <li>Structured the application for maintainability using modular components, REST controllers, and environment-based configuration</li>
        <li>Packaged the backend as an executable Spring Boot JAR with logging and properties configuration for deployment</li>
      </ul>

      <h4>Tata Consultancy Services (TCS)</h4>
      <p><em>Java Full Stack Developer | Jan 2023 – Jun 2024</em></p>
      <ul>
        <li>Developed and maintained enterprise web applications using Java, Spring Boot, and REST APIs</li>
        <li>Collaborated with cross-functional teams to implement new features and resolve production issues</li>
        <li>Worked with relational databases and performed SQL queries for data retrieval and updates</li>
        <li>Participated in code reviews and followed best practices for clean, maintainable code</li>
      </ul>

      <h4>Infosys</h4>
      <p><em>Java Developer | Jan 2019 – Jan 2023</em></p>
      <ul>
        <li>Built and supported backend services using Java, Spring, and Hibernate</li>
        <li>Developed RESTful APIs consumed by frontend applications</li>
        <li>Assisted in application debugging, performance tuning, and production support</li>
        <li>Worked in Agile environments and contributed to sprint planning and delivery</li>
      </ul>

      <h3>Education</h3>
      <p>Bachelor of Science in Computer Science<br/>San Francisco State University</p>

      <h3>Certifications</h3>
      <ul>
        <li>Oracle Certified Professional: Java SE 8 Developer (OCP)</li>
        <li>Oracle Certified Associate: Java SE 8 Developer (OCA)</li>
      </ul>
    </section>
  )
}

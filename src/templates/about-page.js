import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'

import Logo from '../img/logo.inline.svg'
import UniversityIcon from '../img/university.inline.svg'
import WorkIcon from '../img/source.code.hex.inline.svg'

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'

export const AboutPageTemplate = ({ title, content, contentComponent }) => {
  const PageContent = contentComponent || Content

  return (
    <section className="section section--gradient">
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="section">
              <h2 className="title is-size-3 has-text-weight-bold is-bold-light">
                {title}
              </h2>
              <PageContent className="content" content={content} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

AboutPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const AboutPage = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <AboutPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
      />
    </Layout>
  )
}

AboutPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default () => {
  return (
    <Layout>
      <div class="container">
        <div className="column is-10 is-offset-1">
          <Link to="/resume">
            <button className="button is-link is-large is-fullwidth">
              View Resume
            </button>
          </Link>
        </div>
        <VerticalTimeline>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            date="2019 - present"
            dateClassName="text-gray-800"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            icon={<WorkIcon />}
          >
            <h3 className="vertical-timeline-element-title">Web Engineer</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Great Falls, MT
            </h4>
            <p>
              Studied and applied web technologies including HTML, CSS, Golang, and Javascript. Crafted JAMSTACK websites utilizing GatsbyJS and NextJS React frameworks with serverless functions written in Golang and NodeJS.
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="2017 - 2019"
            dateClassName="text-gray-800"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            icon={<WorkIcon />}
          >
            <h3 className="vertical-timeline-element-title">
              Software Engineer I / Software Engineer II
            </h3>
            <h4 className="vertical-timeline-element-subtitle">Tucson, AZ</h4>
            <p>Worked on real time embedded systems utilizing test driven development in C++, CI/CD using Jenkins, and Agile software development principles.</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2012 - 2016"
            dateClassName="text-gray-800"
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            icon={<UniversityIcon />}
          >
            <h3 className="vertical-timeline-element-title">
              Bachelor of Science in Computer Science
            </h3>
            <h4 className="vertical-timeline-element-subtitle">
              Bachelor Degree
            </h4>
            <p>Montana State University - Bozeman</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
            icon={<Logo />}
          />
        </VerticalTimeline>
      </div>
    </Layout>
  )
}

export const aboutPageQuery = graphql`
  query AboutPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`

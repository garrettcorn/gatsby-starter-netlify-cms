import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'

export const ResumePageTemplate = ({ title, content, contentComponent }) => {
  const PageContent = contentComponent || Content

  return (
    <section className="section section--gradient">
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h2 className="title is-size-3 has-text-weight-bold is-bold-light">
              {title}
            </h2>
            <PageContent className="content" content={content} />
          </div>
        </div>
      </div>
    </section>
  )
}

ResumePageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const ResumePage = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <ResumePageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
      />
    </Layout>
  )
}

ResumePage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default ResumePage

export const resumePageQuery = graphql`
  query ResumePage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`

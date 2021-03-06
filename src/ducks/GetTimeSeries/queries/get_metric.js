import gql from 'graphql-tag'

export const GET_METRIC = metric => gql`
  query getMetric(
    $metric: String!
    $slug: String!
    $from: DateTime!
    $to: DateTime!
    $interval: String
  ) {
    getMetric(metric: $metric) {
      timeseriesData(slug: $slug, from: $from, to: $to, interval: $interval) {
        datetime
        ${metric}: value
      }
    }
  }
`

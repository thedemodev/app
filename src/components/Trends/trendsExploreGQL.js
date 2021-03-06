import gql from 'graphql-tag'

// TopicSearchSources: TELEGRAM, PROFESSIONAL_TRADERS_CHAT, REDDIT]
export const trendsExploreGQL = gql`
  query topicSearch(
    $from: DateTime!
    $to: DateTime!
    $searchText: String!
    $source: TopicSearchSources
    $interval: String
  ) {
    topicSearch(
      source: $source
      searchText: $searchText
      from: $from
      interval: $interval
      to: $to
    ) {
      chartData {
        mentionsCount
        datetime
      }
    }
  }
`

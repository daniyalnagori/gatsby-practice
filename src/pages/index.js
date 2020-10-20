import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"

// This query is executed at run time by Apollo.
const APOLLO_QUERY = gql`
  {
    bookmarks {
      url
      id
      desc
    }
  }
`

const APOLLO_MUTATION = gql`
  mutation addBookmark($url: String!, $desc: String!) {
    addBookmark(url: $url, desc: $desc) {
      url
    }
  }
`

export default function Home() {
  const { loading, error, data } = useQuery(APOLLO_QUERY)
  // console.log("data", data)
  const [addBookmark] = useMutation(APOLLO_MUTATION)

  let textfield
  const addBookmark1 = () => {
    addBookmark({
      variables: {
        url: textfield.value,
        desc: textfield.value,
      },
      refetchQueries: [{ query: APOLLO_QUERY }],
    })
    console.log("textfield", textfield.value)
  }
  return (
    <div>
      <input type="text" ref={node => (textfield = node)} />
      <button onClick={addBookmark1}>Add Bookmarksss</button>
      <h2>
        Data Received from Apollo Client at runtime from Serverless Function:
      </h2>
      {/* {loading && <p>Loading Client Side Querry...</p>}
      {error && <p>Error: ${error.url}</p>} */}
      {/* {data && data.bookmarks && (
        <div>
          <table border="2">
            <thead>
              <tr>
                <th>ID</th>
                <th> TASK </th>
                <th> STATUS </th>
              </tr>
            </thead>
            <tbody>
              {data.bookmarks.map(bk => {
                console.log(bk)
                return (
                  <tr key={bk.id}>
                    <td> {bk.id} </td>
                    <td>
                      {" "}
                      <a href={bk.url} target="_blank">
                        {" "}
                        {bk.url}{" "}
                      </a>{" "}
                    </td>
                    <td> {bk.desc} </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )} */}
  <p>{JSON.stringify(data)} </p>
    </div>
  )
}

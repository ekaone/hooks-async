import React, { useState, useCallback } from 'react';

import {
  useAsyncCombineSeq,
  useAsyncRun,
  useAsyncTaskDelay,
  useAsyncTaskFetch,
} from 'react-hooks-async';

const Err = ({ error }) => (
  <div>
    Error: {error.name} {error.message}
  </div>
);

const Loading = ({ abort }) => (
  <div>
    Loading...
    <button className="myButton" onClick={abort}>
      Abort request
    </button>
  </div>
);

const GitHubSearch = ({ query }) => {
  const url = `https://api.github.com/search/repositories?q=${query}`;
  const delayTask = useAsyncTaskDelay(500);
  const fetchTask = useAsyncTaskFetch(url);
  const combineTask = useAsyncCombineSeq(delayTask, fetchTask);

  useAsyncRun(combineTask);

  if (delayTask.pending) return <div>waiting...</div>;
  if (fetchTask.error) return <Err error={fetchTask.error} />;
  if (fetchTask.pending) return <Loading abort={fetchTask.abort} />;

  return (
    <ul className="a">
      {fetchTask.result.items.map(({ id, name, html_url }) => (
        <li key={id}>
          <a target="_blank" href={html_url}>
            {name}
          </a>
        </li>
      ))}
    </ul>
  );
};

function App() {
  const [query, setQuery] = useState('');

  return (
    <>
      <div className="header">
        Github Query
        <p>
          Try search project name from Github example <code>React</code>
        </p>
        <div>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
          {query && <GitHubSearch query={query} />}
        </div>
      </div>
    </>
  );
}

export default App;

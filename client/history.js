/**
 * notice there there is no leading path in our input string where we are importing createHistory and createMemoryHistory so history must be some other global module
 */

import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

const history =
  process.env.NODE_ENV === 'test' ? createMemoryHistory() : createHistory();

export default history;

/* 
- we have two different histories that we can create 
    - browser history: 
    - memory history: 
    - while we are testing, if the process.env.Node.Env is test, were not going to create browser history which needs an actual browser to work, were going to create a memory history instead which is just a javascript memory value 
        - with memory history you can still do .back() .forward() you can check the state but it doenst integrate with a web browser

- so if we not testing we use the browserHistory**

- finally we export this history object  and use it in our react router module which is in client/index

*/

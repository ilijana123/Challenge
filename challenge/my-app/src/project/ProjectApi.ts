import { Project } from './Project';

const baseUrl = 'http://localhost:4000';
const url = `${baseUrl}/grid`;

function translateStatusToErrorMessage(status: number) {
  switch (status) {
    case 401:
      return 'Please login again.';
    case 403:
      return 'You do not have permission to view the grid.';
    default:
      return 'There was an error retrieving the grid. Please try again.';
  }
}

function checkStatus(response: Response) {
  if (response.ok) {
    return response;
  } else {
    const httpErrorInfo = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
    console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

    let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
    throw new Error(errorMessage);
  }
}

function parseJSON(response: Response): Promise<string[][]> {
  return response.json();
}

const projectAPI = {
  get() {
    return fetch(url)
      .then(checkStatus)
      .then(parseJSON)
      .catch((error: TypeError) => {
        console.log('log client error ' + error);
        throw new Error('There was an error retrieving the grid. Please try again.');
      });
  }
};

export { projectAPI };

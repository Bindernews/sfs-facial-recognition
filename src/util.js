
export function mockT(f) {
  if (MOCK) {
    setTimeout(f, 1000);
  }
}

export function sendPost(url, data, timeout) {
  // assert(onload && onfail, 'Either onload or onfail not specified');
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    if (timeout) {
      http.timeout = timeout;
    }
    http.onload = () => {
      if (http.status !== 200) {
        const err = new Error(`HTTP error code: ${http.status}`);
        err.http = http;
        reject(err);
      } else {
        resolve(http);
      }
    };
    // Error callback
    http.addEventListener('error', (xhr, ev) => {
      const err = new Error(`HTTP error code: ${http.status}`);
      err.http = http;
      reject(err);
    }, true);
    http.ontimeout = () => {
      const err = new Error('Timeout');
      err.http = http;
      reject(err);
    };
    // Send the request
    http.send(JSON.stringify(data));
  });
}

export default {};

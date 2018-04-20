
export function sendPost(url, data, cb) {
  const http = new XMLHttpRequest();
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/json');
  http.onload = () => {
    if (http.status !== 200) {
      this.setError(`HTTP error ${http.status}`);
    } else {
      // If no error, run the callback
      try {
        cb();
      } catch (err) {
        this.setError(err);
      }
    }
  };
  // Error callback
  http.onerror = () => {
    this.setError(`HTTP error code: ${http.status}`);
  };
  // Send the request
  http.send(JSON.stringify(data));
  return http;
}

export default {};

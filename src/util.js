import React from 'react';
import { Redirect } from 'react-router-dom';

/**
 * Renders a <Redirect> tag if the current object has one set.
 */
function renderRedirect() {
  const to = this.m_redirectTo;
  this.m_redirectTo = null;
  if (typeof to === 'string') {
    return (<Redirect to={to} />);
  }
  return (null);
}

function redirectTo(to) {
  this.m_redirectTo = to;
  this.forceUpdate();
}

export function mixinRedirect(self) {
  self.m_redirectTo = null;
  self.redirectTo = redirectTo.bind(self);
  self.renderRedirect = renderRedirect.bind(self);
  return self;
}

export function sendPost(url, data, timeout) {
  // assert(onload && onfail, 'Either onload or onfail not specified');
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    if (timeout) {
      http.timeout = timeout;
    } else {
      http.timeout = 0;
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

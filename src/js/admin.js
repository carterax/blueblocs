import React from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

document.addEventListener('DOMContentLoaded', function () {
  const el = document.getElementById('blueblocs-admin');
  el ? render(<Button>Hello world</Button>, el) : '';
});

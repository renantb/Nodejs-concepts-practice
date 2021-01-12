const express = require('express');
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());

const projects = [];

function logRequests (request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}]  ${url}`

  console.log(logLabel);

  return next();
};

function validateProjects (request, response, next) {
  const { id } = request.query;

  if(!isUuid(id)) {
    return response.status(400).json({ error:'Invalid Project ID.'})
  };
};

app.use(logRequests);
app.use('/projects/:id', validateProjects);

app.get('/projects', (request, response) => {
  const { title } = request.query;

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  project = {id:uuid(), title, owner };
  projects.push(project);

  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0 ) {
    return response.status(400).json({ error: 'Project not found.'})
  };

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0 ) {
    return response.status(400).json({ error: 'Project not found.'})
  };

  projects.splice(projectIndex, 1);

  return response.status(200).send();
});

app.listen(3333, () =>{
  console.log('🚀 Back-end started!')
});
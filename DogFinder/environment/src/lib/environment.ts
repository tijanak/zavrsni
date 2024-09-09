let port = process.env['NX_PORT'];
let model_port = process.env['NX_NN_PORT'];
let host = process.env['NX_BACKEND_HOST'];
let model_host = process.env['NX_MODEL_HOST'];
export const environment = {
  PORT: port,
  API_URL: `http://${host}:${port}/`,
  MODEL_URL: `http://${model_host}:${model_port}/`,
};

// CRIAÇÃO DA STORE QUE CONTÉM OS ESTADOS
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const SagaMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ? composeWithDevTools(applyMiddleware(SagaMiddleware))
    : applyMiddleware(SagaMiddleware)
    );

    SagaMiddleware.run(rootSaga);

export default store;

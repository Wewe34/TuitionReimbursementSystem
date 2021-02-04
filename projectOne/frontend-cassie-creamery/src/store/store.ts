import {createStore, Store} from 'redux';
import reducer from './reducer/reducer';



const store: Store<any> = createStore(reducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__() )

export default store;
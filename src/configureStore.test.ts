import { configureStore } from './configureStore'
import * as redux from 'redux'
import * as devtools from 'redux-devtools-extension'
import { StoreEnhancer, StoreEnhancerStoreCreator } from 'redux'

describe('configureStore', () => {
  jest.spyOn(redux, 'applyMiddleware')
  jest.spyOn(redux, 'combineReducers')
  jest.spyOn(redux, 'compose')
  jest.spyOn(redux, 'createStore')
  jest.spyOn(devtools, 'composeWithDevTools')

  const reducer: redux.Reducer = (state = {}, _action) => state

  beforeEach(() => jest.clearAllMocks())

  describe('given a function reducer', () => {
    it('calls createStore with the reducer', () => {
      configureStore({ reducer })
      expect(configureStore({ reducer })).toBeInstanceOf(Object)
      expect(redux.applyMiddleware).toHaveBeenCalled()
      expect(devtools.composeWithDevTools).toHaveBeenCalled()
      expect(redux.createStore).toHaveBeenCalledWith(
        reducer,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('given an object of reducers', () => {
    it('calls createStore with the combined reducers', () => {
      const reducer = {
        reducer() {
          return true
        }
      }
      expect(configureStore({ reducer })).toBeInstanceOf(Object)
      expect(redux.combineReducers).toHaveBeenCalledWith(reducer)
      expect(redux.applyMiddleware).toHaveBeenCalled()
      expect(devtools.composeWithDevTools).toHaveBeenCalled()
      expect(redux.createStore).toHaveBeenCalledWith(
        expect.any(Function),
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('given no reducer', () => {
    it('throws', () => {
      expect(configureStore).toThrow(
        'Reducer argument must be a function or an object of functions that can be passed to combineReducers'
      )
    })
  })

  describe('given no middleware', () => {
    it('calls createStore without any middleware', () => {
      expect(configureStore({ middleware: [], reducer })).toBeInstanceOf(Object)
      expect(redux.applyMiddleware).toHaveBeenCalledWith()
      expect(devtools.composeWithDevTools).toHaveBeenCalled()
      expect(redux.createStore).toHaveBeenCalledWith(
        reducer,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('given custom middleware', () => {
    it('calls createStore with custom middleware and without default middleware', () => {
      const thank: redux.Middleware = _store => next => action => next(action)
      expect(configureStore({ middleware: [thank], reducer })).toBeInstanceOf(
        Object
      )
      expect(redux.applyMiddleware).toHaveBeenCalledWith(thank)
      expect(devtools.composeWithDevTools).toHaveBeenCalled()
      expect(redux.createStore).toHaveBeenCalledWith(
        reducer,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('with devTools disabled', () => {
    it('calls createStore without devTools enhancer', () => {
      expect(configureStore({ devTools: false, reducer })).toBeInstanceOf(
        Object
      )
      expect(redux.applyMiddleware).toHaveBeenCalled()
      expect(redux.compose).toHaveBeenCalled()
      expect(redux.createStore).toHaveBeenCalledWith(
        reducer,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('with devTools options', () => {
    it('calls createStore with devTools enhancer and option', () => {
      const options = {
        name: 'myApp',
        trace: true
      }
      expect(configureStore({ devTools: options, reducer })).toBeInstanceOf(
        Object
      )
      expect(redux.applyMiddleware).toHaveBeenCalled()
      expect(devtools.composeWithDevTools).toHaveBeenCalledWith(options)
      expect(redux.createStore).toHaveBeenCalledWith(
        reducer,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('given preloadedState', () => {
    it('calls createStore with preloadedState', () => {
      expect(configureStore({ reducer })).toBeInstanceOf(Object)
      expect(redux.applyMiddleware).toHaveBeenCalled()
      expect(devtools.composeWithDevTools).toHaveBeenCalled()
      expect(redux.createStore).toHaveBeenCalledWith(
        reducer,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('given enhancers', () => {
    it('calls createStore with enhancers', () => {
      const enhancer: redux.StoreEnhancer = next => next
      expect(configureStore({ enhancers: [enhancer], reducer })).toBeInstanceOf(
        Object
      )
      expect(redux.applyMiddleware).toHaveBeenCalled()
      expect(devtools.composeWithDevTools).toHaveBeenCalled()
      expect(redux.createStore).toHaveBeenCalledWith(
        reducer,
        undefined,
        expect.any(Function)
      )
    })

    it('accepts a callback for customizing enhancers', () => {
      let dummyEnhancerCalled = false

      const dummyEnhancer: StoreEnhancer = (
        createStore: StoreEnhancerStoreCreator
      ) => (reducer, ...args: any[]) => {
        dummyEnhancerCalled = true

        return createStore(reducer, ...args)
      }

      const reducer = () => ({})

      const store = configureStore({
        reducer,
        enhancers: defaultEnhancers => {
          return [...defaultEnhancers, dummyEnhancer]
        }
      })

      expect(dummyEnhancerCalled).toBe(true)
    })
  })
})

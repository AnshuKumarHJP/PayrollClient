import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from './Store/Store'
import App from './App'

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    // Basic test to ensure the app renders
    expect(document.body).toBeInTheDocument()
  })
})

import { LangProvider } from './LangContext.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Products from './components/Products.jsx'
import About from './components/About.jsx'
import Technology from './components/Technology.jsx'
import Materials from './components/Materials.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <LangProvider>
      <Nav />
      <main>
        <Hero />
        <Products />
        <About />
        <Technology />
        <Materials />
        <Contact />
      </main>
      <Footer />
    </LangProvider>
  )
}

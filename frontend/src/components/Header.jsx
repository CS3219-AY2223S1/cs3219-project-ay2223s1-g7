import { FaSignInAlt, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Header() {

  return (
    <header className="header">
      <div className='logo'>
        CS3219
      </div>
      <ul>
        <li>
        <a href="/signup">
          <FaUser /> Register
        </a>
        </li>
        <li>
        <a href="/login">
          <FaSignInAlt /> Login
        </a> 
        </li>
      </ul>
    </header>
  )
}

export default Header
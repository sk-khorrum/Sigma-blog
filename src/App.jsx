import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import PostCard from './components/PostCard'
import PostDetail from './components/PostDetail'
import LoginModal from './components/LoginModal'
import Footer from './components/Footer'
import SEOHead from './components/SEOHead'
import postsData from './data/posts.json'

function App() {
  const [posts] = useState(postsData)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem('current_user')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const handleReadMore = (post) => {
    navigate(`/posts/${post.slug}`)
  }

  const handleLogin = (user) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    localStorage.removeItem('current_user')
    setCurrentUser(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <Routes>
        <Route path="/" element={ 
          <>
            <SEOHead isHomePage={true} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Hero Section */}
              <section className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                  Welcome to SIGMA BLOGS
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Discover insightful articles, connect with amazing authors, and join our 
                  growing community of readers and writers from around the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Start Reading
                  </button>
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Join Community
                  </button>
                </div>
              </section>

              {/* Featured Posts */}
              {posts.filter(post => post.featured).length > 0 && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Posts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.filter(post => post.featured).map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onReadMore={handleReadMore}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Latest Posts */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.filter(post => !post.featured).map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      onReadMore={handleReadMore}
                    />
                  ))}
                </div>
              </section>

              {/* Newsletter Signup */}
              <section className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                <p className="text-lg mb-6 opacity-90">
                  Get the latest posts delivered directly to your inbox
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg text-gray-900"
                  />
                  <button className="px-6 py-2 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </section>
            </main>
          </>
        } />

        <Route 
          path="/posts/:slug" 
          element={ 
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <PostDetailWrapper posts={posts} currentUser={currentUser} />
            </main>
          }
        />
      </Routes>

      <Footer />
      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}

const PostDetailWrapper = ({ posts, currentUser }) => {
  const { slug } = useParams()
  const post = posts.find(p => p.slug === slug)
  const navigate = useNavigate()

  useEffect(() => {
    if (!post) {
      navigate('/')
    }
  }, [post, navigate])

  if (!post) {
    return null
  }

  return <PostDetail post={post} onBack={() => navigate('/')} currentUser={currentUser} />
}

export default App



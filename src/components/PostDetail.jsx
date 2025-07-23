import { useState, useEffect } from 'react'
import { Calendar, Clock, User, Badge, ArrowLeft, MessageCircle, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Comments from './Comments'
import GoogleTranslate from './GoogleTranslate'

const PostDetail = ({ post, onBack, currentUser }) => {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    // Load likes from localStorage
    const savedLikes = localStorage.getItem(`post_${post.id}_likes`)
    const userLiked = localStorage.getItem(`post_${post.id}_liked_${currentUser?.id || 'anonymous'}`)
    
    if (savedLikes) {
      setLikes(parseInt(savedLikes))
    }
    if (userLiked === 'true') {
      setIsLiked(true)
    }
  }, [post.id, currentUser])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleLike = () => {
    if (!currentUser) {
      alert('Please login to like posts')
      return
    }

    const newLiked = !isLiked
    const newLikes = newLiked ? likes + 1 : likes - 1
    
    setIsLiked(newLiked)
    setLikes(newLikes)
    
    localStorage.setItem(`post_${post.id}_likes`, newLikes.toString())
    localStorage.setItem(`post_${post.id}_liked_${currentUser.id}`, newLiked.toString())
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to posts
          </Button>
      </div>

      {/* Featured image */}
      {post.image && (
        <div className="aspect-video overflow-hidden rounded-lg mb-8">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post header */}
      <header className="mb-8">
        {post.featured && (
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
              Featured Post
            </span>
          </div>
        )}
        
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
            {post.category}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              {post.readTime} min read
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <Button 
              variant={isLiked ? "default" : "outline"} 
              size="sm"
              onClick={handleLike}
              className="flex items-center space-x-1"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Author info */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
              {post.author.verified && (
                <Badge className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <p className="text-gray-600 text-sm">{post.author.bio}</p>
          </div>
        </div>
      </header>

      {/* Post content */}
      <div className="prose prose-lg max-w-none mb-12">
        {post.content.split('\n').map((paragraph, index) => {
          if (paragraph.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>
          } else if (paragraph.startsWith('# ')) {
            return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.replace('# ', '')}</h1>
          } else if (paragraph.trim() === '') {
            return <br key={index} />
          } else {
            return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
          }
        })}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Google Translate Widget */}
      <div className="mb-12 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Translate this post</h3>
        <p className="text-gray-600 mb-4">Read this post in your preferred language</p>
        <GoogleTranslate />
      </div>

      {/* Comments section */}
      <Comments postId={post.id} currentUser={currentUser} />
    </article>
  )
}

export default PostDetail


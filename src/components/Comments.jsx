import { useState, useEffect } from 'react'
import { MessageCircle, Reply, Heart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Comments = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    // Load comments from localStorage
    const savedComments = localStorage.getItem(`comments_post_${postId}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }
  }, [postId])

  const saveComments = (updatedComments) => {
    localStorage.setItem(`comments_post_${postId}`, JSON.stringify(updatedComments))
    setComments(updatedComments)
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!currentUser) {
      alert('Please login to comment')
      return
    }
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      text: newComment,
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
      },
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    }

    const updatedComments = [...comments, comment]
    saveComments(updatedComments)
    setNewComment('')
  }

  const handleSubmitReply = (e, parentId) => {
    e.preventDefault()
    if (!currentUser) {
      alert('Please login to reply')
      return
    }
    if (!replyText.trim()) return

    const reply = {
      id: Date.now(),
      text: replyText,
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
      },
      timestamp: new Date().toISOString(),
      likes: 0
    }

    const updatedComments = comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...comment.replies, reply]
        }
      }
      return comment
    })

    saveComments(updatedComments)
    setReplyText('')
    setReplyTo(null)
  }

  const handleLikeComment = (commentId, isReply = false, parentId = null) => {
    if (!currentUser) {
      alert('Please login to like comments')
      return
    }

    const updatedComments = comments.map(comment => {
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              return { ...reply, likes: reply.likes + 1 }
            }
            return reply
          })
        }
      } else if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 }
      }
      return comment
    })

    saveComments(updatedComments)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="border-t pt-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <MessageCircle className="h-6 w-6 mr-2" />
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex space-x-3">
            <img 
              src={currentUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} 
              alt={currentUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="3"
              />
              <div className="mt-2 flex justify-end">
                <Button type="submit" disabled={!newComment.trim()}>
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">Please login to join the conversation</p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white">
            <div className="flex space-x-3">
              <img 
                src={comment.author.avatar} 
                alt={comment.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{comment.author.name}</h4>
                    <span className="text-sm text-gray-500">{formatDate(comment.timestamp)}</span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
                
                <div className="flex items-center space-x-4 mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleLikeComment(comment.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {comment.likes}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    className="text-gray-500 hover:text-primary"
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                </div>

                {/* Reply form */}
                {replyTo === comment.id && currentUser && (
                  <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4">
                    <div className="flex space-x-3">
                      <img 
                        src={currentUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"} 
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${comment.author.name}...`}
                          className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows="2"
                        />
                        <div className="mt-2 flex justify-end space-x-2">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setReplyTo(null)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" size="sm" disabled={!replyText.trim()}>
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-6 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex space-x-3">
                        <img 
                          src={reply.author.avatar} 
                          alt={reply.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">{reply.author.name}</h5>
                              <span className="text-xs text-gray-500">{formatDate(reply.timestamp)}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{reply.text}</p>
                          </div>
                          <div className="mt-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleLikeComment(reply.id, true, comment.id)}
                              className="text-gray-500 hover:text-red-500 text-xs"
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              {reply.likes}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  )
}

export default Comments


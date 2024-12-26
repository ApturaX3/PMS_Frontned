import React, { useState } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar, Flag, MessageSquare, Send, Tag, User } from 'react-feather'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

interface TaskDetailsProps {
  isOpen: boolean
  onClose: () => void
  task: {
    id: string
    content: string
    description: string
    priority: 'low' | 'medium' | 'high'
    assignee: {
      name: string
      avatar: string
    }
    reporter: {
      name: string
      avatar: string
    }
    company: string
    marketingMaterials: {
      datasheet: boolean
      factsheet: boolean
      ads: boolean
    }
    brochureStatus: string
    comparisonSheetStatus: string
    labels: string[]
    orderNumber: string
    dueDate: string
    status: string
    comments: {
      id: string
      author: string
      avatar: string
      content: string
      timestamp: string
    }[]
  } | null
}

export function TaskDetails({ isOpen, onClose, task }: TaskDetailsProps) {
  const [description, setDescription] = useState(task?.description || '')
  const [newComment, setNewComment] = useState('')

  if (!task) return null

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
    // Here you would typically update the task description in your state or backend
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically add the new comment to your state or backend
    setNewComment('')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-gradient-to-br from-purple-50 to-indigo-50">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={70}>
            <div className="h-full flex flex-col">
              <div className="p-6 border-b bg-white shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-indigo-700">{task.content}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                      {task.status}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={getPriorityColor(task.priority)}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <Textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Add a description..."
                  className="min-h-[100px] border-indigo-200 focus:border-indigo-400 focus:ring-indigo-300"
                />
              </div>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={70}>
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-6">
                      <div className="grid gap-4">
                        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                          <Flag className="w-5 h-5 text-indigo-500" />
                          <div>
                            <Label className="text-sm text-indigo-600">Priority</Label>
                            <p className="font-medium text-indigo-900">{task.priority}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                          <User className="w-5 h-5 text-indigo-500" />
                          <div className="flex items-center gap-6">
                            <div>
                              <Label className="text-sm text-indigo-600">Assignee</Label>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={task.assignee.avatar} />
                                  <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-indigo-900">{task.assignee.name || 'Unassigned'}</span>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm text-indigo-600">Reporter</Label>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={task.reporter.avatar} />
                                  <AvatarFallback>{task.reporter.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-indigo-900">{task.reporter.name || 'None'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                          <AlertCircle className="w-5 h-5 text-indigo-500" />
                          <div>
                            <Label className="text-sm text-indigo-600">Company</Label>
                            <p className="font-medium text-indigo-900">{task.company || 'Not specified'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                          <Calendar className="w-5 h-5 text-indigo-500" />
                          <div>
                            <Label className="text-sm text-indigo-600">Due Date</Label>
                            <p className="font-medium text-indigo-900">{task.dueDate || 'No due date'}</p>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-indigo-200" />

                      <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-indigo-700">Marketing Materials Needed</h3>
                        <div className="grid gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="datasheet" checked={task.marketingMaterials.datasheet} />
                            <label htmlFor="datasheet" className="text-indigo-900">Product Datasheet</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="factsheet" checked={task.marketingMaterials.factsheet} />
                            <label htmlFor="factsheet" className="text-indigo-900">Product Factsheet</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="ads" checked={task.marketingMaterials.ads} />
                            <label htmlFor="ads" className="text-indigo-900">Product Ads</label>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-indigo-200" />

                      <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
                        <div>
                          <Label className="text-sm text-indigo-600">Product Brochure</Label>
                          <p className="font-medium text-indigo-900">{task.brochureStatus || 'Not started'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-indigo-600">Product Comparison Sheet</Label>
                          <p className="font-medium text-indigo-900">{task.comparisonSheetStatus || 'Not started'}</p>
                        </div>
                      </div>

                      <Separator className="bg-indigo-200" />

                      <div className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
                        <Label className="text-sm text-indigo-600">Labels</Label>
                        <div className="flex gap-2">
                          {task.labels.length > 0 ? (
                            task.labels.map((label) => (
                              <Badge key={label} variant="secondary" className="bg-indigo-100 text-indigo-800 border-indigo-300">
                                <Tag className="w-3 h-3 mr-1" />
                                {label}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-indigo-500">No labels</span>
                          )}
                        </div>
                      </div>

                      <Separator className="bg-indigo-200" />

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <Label className="text-sm text-indigo-600">Order Number</Label>
                        <p className="font-medium text-indigo-900">{task.orderNumber || 'Not assigned'}</p>
                      </div>
                    </div>
                  </ScrollArea>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>
          <ResizableHandle className="bg-indigo-200 w-1" />
          <ResizablePanel defaultSize={30} style={{ maxWidth: '60%' }}>
            <div className="h-full flex flex-col bg-white">
              <div className="p-6 border-b bg-indigo-50">
                <h3 className="font-semibold flex items-center gap-2 text-indigo-700">
                  <MessageSquare className="w-5 h-5" />
                  Comments
                </h3>
              </div>
              <ScrollArea className="flex-grow">
                <div className="p-6 space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 bg-indigo-50 p-3 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-indigo-900">{comment.author}</span>
                          <span className="text-xs text-indigo-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-indigo-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-indigo-50">
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[80px] border-indigo-200 focus:border-indigo-400 focus:ring-indigo-300"
                  />
                  <Button type="submit" size="icon" className="bg-indigo-600 hover:bg-indigo-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DialogContent>
    </Dialog>
  )
}


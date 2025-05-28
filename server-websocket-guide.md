# WebSocket Server-Side Implementation Guide

This guide shows the modifications needed in your server-side course routes to ensure real-time updates work properly with the frontend.

## Course Selection Route Modification

In your `/courses/select` route, you need to emit the `courseUpdated` event after a successful course selection. Here's how to modify it:

```javascript
// In your course.route.js file, update the course selection endpoint
app.post('/courses/select', async (req, res) => {
  try {
    const { email, courseId } = req.body;
    
    // Your existing course selection logic here...
    // After successful course update in database:
    
    const updatedCourse = await Course.findById(courseId);
    
    // Emit real-time update to all clients in this course room
    req.io.to(courseId).emit('courseUpdated', {
      courseId: courseId,
      seatsAvailable: updatedCourse.seatsAvailable
    });
    
    // Also broadcast general course statistics update
    await req.broadcastCourseStatistics();
    
    res.json({
      success: true,
      seatsAvailable: updatedCourse.seatsAvailable,
      message: 'Course selected successfully'
    });
    
  } catch (error) {
    console.error('Error selecting course:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
```

## Additional Course Update Events

For any other operations that modify course data (admin updates, cancellations, etc.), make sure to emit the `courseUpdated` event:

```javascript
// Example for admin course updates
app.put('/admin/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const updates = req.body;
    
    // Update course in database
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updates, { new: true });
    
    // Emit real-time update
    req.io.to(courseId).emit('courseUpdated', {
      courseId: courseId,
      seatsAvailable: updatedCourse.seatsAvailable
    });
    
    // Broadcast general statistics
    await req.broadcastCourseStatistics();
    
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

## WebSocket Event Structure

Make sure your server emits events in the following format:

### courseUpdated Event
```javascript
{
  courseId: string,
  seatsAvailable: number
}
```

### courseStatisticsUpdate Event
```javascript
{
  courses: [
    {
      courseCode: string,
      seatsAvailable: number,
      enrolledCount: number,
      totalCapacity: number,
      enrollmentPercentage: string
    }
  ]
}
```

### courseCountUpdate Event
```javascript
{
  totalCourses: number
}
```

## Room Management

Ensure clients join/leave rooms properly:
- When a client joins, they should emit `joinCourse` with the courseId
- When they leave or disconnect, they should emit `leaveCourse` with the courseId
- Your server should handle these events to manage socket rooms

## Testing the Implementation

1. Open multiple browser tabs/windows
2. Select the same course in different tabs
3. When one user selects a course, all other users should see the seat count update in real-time
4. Check the browser console for WebSocket connection status and event logs

## Frontend Features Added

The frontend now includes:
- ✅ Real-time seat count updates
- ✅ Connection status indicator (Live/Offline)
- ✅ Automatic course statistics updates
- ✅ Better error handling and reconnection
- ✅ Proper event cleanup on component unmount
- ✅ Console logging for debugging

The WebSocket connection will automatically reconnect if disconnected and show the connection status in the UI.

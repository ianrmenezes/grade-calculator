# Grade Calculator

A modern, clean, and responsive web application for calculating weighted grades with real-time updates and visual feedback.

## 🌐 Live Site

**Visit the live application:** [https://ianrmenezes.github.io/grade-calculator/](https://ianrmenezes.github.io/grade-calculator/)

## ✨ Features

### Core Functionality
- **Weighted Grade Calculation**: Automatically calculates final grades based on assignment weights
- **Real-time Updates**: Results update instantly as you type
- **Multiple Assignments**: Add unlimited assignments with custom names, weights, and grades
- **Input Validation**: Warns when total weight exceeds 100% or is incomplete

### User Interface
- **Clean & Modern Design**: Built with Tailwind CSS for a professional look
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Subtle transitions and hover effects for better UX
- **Visual Feedback**: Color-coded weight indicators and grade letters

### Advanced Features
- **Grade Distribution Chart**: Interactive donut chart showing grade distribution by letter grades
- **Grade Summary**: Shows total assignments, average, highest, and lowest grades
- **Letter Grade Conversion**: Automatically converts numerical grades to letter grades
- **Reset Functionality**: Clear all data with confirmation dialog

### User Experience
- **Keyboard Navigation**: Press Enter to quickly add new rows
- **Delete Rows**: Remove individual assignments with smooth animations
- **Mobile-Friendly**: Optimized for touch devices with appropriate button sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## 🚀 Getting Started

### Option 1: Use the Live Site (Recommended)
**Visit:** [https://ianrmenezes.github.io/grade-calculator/](https://ianrmenezes.github.io/grade-calculator/)

No download required - just open the link and start calculating!

### Option 2: Run Locally
1. **Clone or Download** the project files
2. **Open `index.html`** in your web browser
3. **Start Calculating** your grades!

No installation or setup required - it's a pure HTML/CSS/JavaScript application.

## 📱 How to Use

### Adding Assignments
1. Enter the assignment name in the first column
2. Set the weight percentage (how much this assignment counts toward your final grade)
3. Enter your grade percentage
4. Use "Add Row" to add more assignments

### Understanding Results
- **Final Grade**: Your weighted average grade
- **Letter Grade**: Corresponding letter grade (A, B, C, D, F)
- **Total Weight**: Sum of all assignment weights (should be 100% or less)
- **Chart**: Visual distribution of your grades by letter grade ranges

### Tips
- Weights should total 100% for accurate calculations
- You can have weights less than 100% (e.g., if some assignments are optional)
- Grades are automatically calculated as you type
- Use the reset button to start over

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup structure
- **CSS3**: Styling with Tailwind CSS framework
- **JavaScript (ES6+)**: Modern JavaScript with classes and modules
- **Chart.js**: Interactive data visualization
- **Font Awesome**: Icons for better UX

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- Lightweight (no heavy frameworks)
- Fast real-time calculations
- Smooth animations without performance impact
- Responsive design with mobile-first approach

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue (#3B82F6) for main elements
- **Success**: Green (#10B981) for positive indicators
- **Warning**: Yellow (#F59E0B) for caution states
- **Error**: Red (#EF4444) for errors and deletions
- **Neutral**: Gray scale for text and backgrounds

### Animations
- **Fade In**: Page elements appear smoothly
- **Slide In**: New rows slide in from the left
- **Bounce In**: Final grade updates with bounce effect
- **Fade Out**: Deleted rows fade out gracefully
- **Hover Effects**: Buttons and inputs have subtle hover states

### Responsive Design
- **Desktop**: Full layout with side-by-side sections
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Single column layout with touch-friendly buttons

## 📄 License

This project is open source and available under the MIT License. 
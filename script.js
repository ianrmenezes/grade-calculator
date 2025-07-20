class GradeCalculator {
    constructor() {
        this.assignments = [];
        this.chart = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addInitialRow();
        this.updateChart();
        this.setupFinalExamCalculator();
    }

    setupEventListeners() {
        document.getElementById('addRowBtn').addEventListener('click', () => this.addRow());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }

    setupFinalExamCalculator() {
        // Add event listeners for final exam calculator inputs
        const finalExamInputs = [
            'currentWorth',
            'currentMark', 
            'finalExamWorth'
        ];

        finalExamInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateFinalExamCalculations());
            }
        });
    }

    addInitialRow() {
        this.addRow();
    }

    addRow() {
        const tbody = document.getElementById('assignmentsTable');
        const row = document.createElement('tr');
        row.className = 'assignment-row slide-in';
        
        const assignmentId = Date.now() + Math.random();
        
        row.innerHTML = `
            <td class="py-3 px-2">
                <input type="text" class="assignment-name w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                       placeholder="Course item name" data-id="${assignmentId}">
            </td>
            <td class="py-3 px-2">
                <input type="number" class="assignment-weight w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                       placeholder="0" min="0" max="100" step="0.1" data-id="${assignmentId}">
            </td>
            <td class="py-3 px-2">
                <input type="number" class="assignment-grade w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                       placeholder="0" min="0" max="100" step="0.1" data-id="${assignmentId}">
            </td>
            <td class="py-3 px-2">
                <button class="delete-row bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all duration-200" data-id="${assignmentId}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);

        // Add event listeners to the new row
        this.addRowEventListeners(row, assignmentId);
        
        // Animate the new row
        setTimeout(() => {
            row.classList.remove('slide-in');
        }, 400);
    }

    addRowEventListeners(row, assignmentId) {
        const nameInput = row.querySelector('.assignment-name');
        const weightInput = row.querySelector('.assignment-weight');
        const gradeInput = row.querySelector('.assignment-grade');
        const deleteBtn = row.querySelector('.delete-row');

        // Add input event listeners
        [nameInput, weightInput, gradeInput].forEach(input => {
            input.addEventListener('input', () => {
                this.updateCalculations();
                this.autoUpdateFinalExamCalculator();
            });
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.addRow();
                }
            });
        });

        // Add delete button listener
        deleteBtn.addEventListener('click', () => {
            row.classList.add('fade-out');
            setTimeout(() => {
                row.remove();
                this.updateCalculations();
                this.autoUpdateFinalExamCalculator();
            }, 300);
        });
    }

    getAssignmentsData() {
        const rows = document.querySelectorAll('.assignment-row');
        const assignments = [];

        rows.forEach(row => {
            const nameInput = row.querySelector('.assignment-name');
            const weightInput = row.querySelector('.assignment-weight');
            const gradeInput = row.querySelector('.assignment-grade');

            const name = nameInput.value.trim();
            const weight = parseFloat(weightInput.value) || 0;
            const grade = parseFloat(gradeInput.value) || 0;

            if (name && weight > 0) {
                assignments.push({ name, weight, grade });
            }
        });

        return assignments;
    }

    updateCalculations() {
        const assignments = this.getAssignmentsData();
        this.assignments = assignments;

        // Calculate totals
        const totalWeight = assignments.reduce((sum, assignment) => sum + assignment.weight, 0);
        const weightedSum = assignments.reduce((sum, assignment) => sum + (assignment.grade * assignment.weight), 0);
        const finalGrade = totalWeight > 0 ? weightedSum / totalWeight : 0;

        // Update displays
        this.updateTotalWeight(totalWeight);
        this.updateFinalGrade(finalGrade);
        this.updateGradeLetter(finalGrade);
        this.updateSummary(assignments);
        this.updateWeightWarning(totalWeight);
        this.updateChart();

        // Add animation to final grade
        const finalGradeElement = document.getElementById('finalGrade');
        finalGradeElement.classList.add('bounce-in');
        setTimeout(() => {
            finalGradeElement.classList.remove('bounce-in');
        }, 600);
    }

    autoUpdateFinalExamCalculator() {
        const assignments = this.getAssignmentsData();
        
        if (assignments.length === 0) return;

        // Calculate current course progress from entered course items
        const totalWeight = assignments.reduce((sum, assignment) => sum + assignment.weight, 0);
        const weightedSum = assignments.reduce((sum, assignment) => sum + (assignment.grade * assignment.weight), 0);
        const currentMark = totalWeight > 0 ? weightedSum / totalWeight : 0;
        
        // Calculate final exam weight (what's left to reach 100%)
        const finalExamWorth = Math.max(0, 100 - totalWeight);
        
        // Update the final exam calculator inputs
        document.getElementById('currentWorth').value = totalWeight.toFixed(1);
        document.getElementById('currentMark').value = currentMark.toFixed(1);
        document.getElementById('finalExamWorth').value = finalExamWorth.toFixed(1);
        
        // Update the calculations
        this.updateFinalExamCalculations();
    }

    updateFinalExamCalculations() {
        const currentWorth = parseFloat(document.getElementById('currentWorth').value) || 0;
        const currentMark = parseFloat(document.getElementById('currentMark').value) || 0;
        const finalExamWorth = parseFloat(document.getElementById('finalExamWorth').value) || 0;

        // Calculate current course mark contribution
        const currentCourseMark = (currentWorth * currentMark) / 100;
        document.getElementById('currentCourseMark').textContent = `${currentCourseMark.toFixed(2)}%`;

        // Calculate required final exam scores for different targets
        const targets = [50, 60, 70, 80, 90, 100];
        
        targets.forEach(target => {
            const requiredFinal = this.calculateRequiredFinal(currentCourseMark, finalExamWorth, target);
            const element = document.getElementById(`required${target}`);
            
            if (element) {
                if (requiredFinal === null) {
                    element.textContent = 'N/A';
                    element.className = 'font-semibold text-gray-500';
                } else {
                    element.textContent = `${requiredFinal.toFixed(1)}%`;
                    
                    // Color coding based on feasibility
                    if (requiredFinal < 0) {
                        element.className = 'font-semibold text-green-600';
                    } else if (requiredFinal > 100) {
                        element.className = 'font-semibold text-red-600';
                    } else {
                        element.className = 'font-semibold text-gray-800';
                    }
                }
            }
        });

        // Add animation to results
        const resultsContainer = document.querySelector('.space-y-3');
        if (resultsContainer) {
            resultsContainer.classList.add('bounce-in');
            setTimeout(() => {
                resultsContainer.classList.remove('bounce-in');
            }, 600);
        }
    }

    calculateRequiredFinal(currentCourseMark, finalExamWorth, targetGrade) {
        if (finalExamWorth === 0) return null;
        
        // Formula: (Target Grade - Current Course Mark) / Final Exam Weight * 100
        const requiredFinal = ((targetGrade - currentCourseMark) / finalExamWorth) * 100;
        
        return requiredFinal;
    }

    updateTotalWeight(totalWeight) {
        const totalWeightElement = document.getElementById('totalWeight');
        totalWeightElement.textContent = `${totalWeight.toFixed(1)}%`;
        
        // Color coding for weight
        if (totalWeight > 100) {
            totalWeightElement.className = 'text-lg font-bold text-red-600';
        } else if (totalWeight === 100) {
            totalWeightElement.className = 'text-lg font-bold text-green-600';
        } else {
            totalWeightElement.className = 'text-lg font-bold text-green-600';
        }
    }

    updateFinalGrade(finalGrade) {
        const finalGradeElement = document.getElementById('finalGrade');
        finalGradeElement.textContent = `${finalGrade.toFixed(2)}%`;
    }

    updateGradeLetter(finalGrade) {
        const gradeLetterElement = document.getElementById('gradeLetter');
        let letter = '-';
        let color = 'text-gray-600';

        if (finalGrade >= 93) {
            letter = 'A';
            color = 'text-green-600';
        } else if (finalGrade >= 90) {
            letter = 'A-';
            color = 'text-green-600';
        } else if (finalGrade >= 87) {
            letter = 'B+';
            color = 'text-blue-600';
        } else if (finalGrade >= 83) {
            letter = 'B';
            color = 'text-blue-600';
        } else if (finalGrade >= 80) {
            letter = 'B-';
            color = 'text-blue-600';
        } else if (finalGrade >= 77) {
            letter = 'C+';
            color = 'text-yellow-600';
        } else if (finalGrade >= 73) {
            letter = 'C';
            color = 'text-yellow-600';
        } else if (finalGrade >= 70) {
            letter = 'C-';
            color = 'text-yellow-600';
        } else if (finalGrade >= 67) {
            letter = 'D+';
            color = 'text-orange-600';
        } else if (finalGrade >= 63) {
            letter = 'D';
            color = 'text-orange-600';
        } else if (finalGrade >= 60) {
            letter = 'D-';
            color = 'text-orange-600';
        } else if (finalGrade >= 50) {
            letter = 'D-';
            color = 'text-orange-600';
        } else if (finalGrade > 0) {
            letter = 'F';
            color = 'text-red-600';
        }

        gradeLetterElement.textContent = letter;
        gradeLetterElement.className = `text-xl font-semibold ${color}`;
    }

    updateSummary(assignments) {
        const totalAssignments = assignments.length;
        const grades = assignments.map(a => a.grade).filter(g => g > 0);
        
        const averageGrade = grades.length > 0 ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length : 0;
        const highestGrade = grades.length > 0 ? Math.max(...grades) : 0;
        const lowestGrade = grades.length > 0 ? Math.min(...grades) : 0;

        document.getElementById('totalAssignments').textContent = totalAssignments;
        document.getElementById('averageGrade').textContent = `${averageGrade.toFixed(2)}%`;
        document.getElementById('highestGrade').textContent = `${highestGrade.toFixed(2)}%`;
        document.getElementById('lowestGrade').textContent = `${lowestGrade.toFixed(2)}%`;
    }

    updateWeightWarning(totalWeight) {
        const warningElement = document.getElementById('weightWarning');
        const warningText = document.getElementById('weightWarningText');

        if (totalWeight > 100) {
            warningElement.classList.remove('hidden');
            warningText.textContent = `Total weight is ${totalWeight.toFixed(1)}% (exceeds 100%)`;
        } else if (totalWeight < 100 && totalWeight > 0) {
            warningElement.classList.remove('hidden');
            warningText.textContent = `Total weight is ${totalWeight.toFixed(1)}% (less than 100%)`;
        } else {
            warningElement.classList.add('hidden');
        }
    }

    updateChart() {
        const ctx = document.getElementById('gradeChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        const assignments = this.assignments;
        
        if (assignments.length === 0) {
            // Show empty state
            this.chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['No Data'],
                    datasets: [{
                        data: [1],
                        backgroundColor: ['#e5e7eb'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        }
                    },
                    cutout: '70%'
                }
            });
            return;
        }

        // Create grade distribution data
        const gradeRanges = [
            { min: 90, max: 100, label: 'A (90-100)', color: '#10b981' },
            { min: 80, max: 89.99, label: 'B (80-89)', color: '#3b82f6' },
            { min: 70, max: 79.99, label: 'C (70-79)', color: '#f59e0b' },
            { min: 50, max: 69.99, label: 'D (50-69)', color: '#f97316' },
            { min: 0, max: 49.99, label: 'F (0-49)', color: '#ef4444' }
        ];

        const distribution = gradeRanges.map(range => {
            const count = assignments.filter(a => a.grade >= range.min && a.grade <= range.max).length;
            return count;
        });

        const labels = gradeRanges.map(range => range.label);
        const colors = gradeRanges.map(range => range.color);

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: distribution,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            usePointStyle: true,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                                return `${context.label}: ${context.parsed} course item(s) (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%',
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    }

    reset() {
        // Add confirmation
        if (!confirm('Are you sure you want to reset all data?')) {
            return;
        }

        const tbody = document.getElementById('assignmentsTable');
        tbody.innerHTML = '';
        
        this.assignments = [];
        this.updateCalculations();
        this.addInitialRow();
        
        // Reset final exam calculator
        document.getElementById('currentWorth').value = '';
        document.getElementById('currentMark').value = '';
        document.getElementById('finalExamWorth').value = '';
        document.getElementById('currentCourseMark').textContent = '0.00%';
        
        // Reset required final exam scores
        [50, 60, 70, 80, 90, 100].forEach(target => {
            const element = document.getElementById(`required${target}`);
            if (element) {
                element.textContent = '-';
                element.className = 'font-semibold text-gray-800';
            }
        });
        
        // Show reset animation
        const resetBtn = document.getElementById('resetBtn');
        resetBtn.classList.add('bounce-in');
        setTimeout(() => {
            resetBtn.classList.remove('bounce-in');
        }, 600);
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GradeCalculator();
});

// Add some additional CSS for animations
const style = document.createElement('style');
style.textContent = `
    .fade-out {
        animation: fadeOut 0.3s ease-in-out forwards;
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    .assignment-row:hover {
        background-color: #f8fafc;
        transition: background-color 0.2s ease;
    }
    
    input:focus {
        transform: scale(1.02);
        transition: transform 0.2s ease;
    }
    
    button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    @media (max-width: 768px) {
        .container {
            padding: 1rem;
        }
        
        .grid {
            grid-template-columns: 1fr;
        }
        
        .text-4xl {
            font-size: 2rem;
        }
        
        .text-2xl {
            font-size: 1.5rem;
        }
    }
`;
document.head.appendChild(style); 
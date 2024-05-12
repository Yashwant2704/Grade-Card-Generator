document.addEventListener('DOMContentLoaded', function() {
    let courseDetails = [];
    let studentDetails = {};

    document.getElementById('studentDetailsForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        studentDetails = Object.fromEntries(formData);

        document.getElementById('studentDetails').style.display = 'none';
        document.getElementById('courseDetails').style.display = 'block';
    });

    document.getElementById('courseDetailsForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        courseDetails.push(data);

        const row = document.createElement('tr');
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const cell = document.createElement('td');
                cell.textContent = data[key];
                row.appendChild(cell);
            }
        }
        document.querySelector('#gradeCard tbody').appendChild(row);

        event.target.reset();

        calculateAndDisplaySGPA();
        calculateAndDisplayCGPA();
    });

    document.getElementById('generateGradeCard').addEventListener('click', function() {
        generatePDF();
    });

    function calculateAndDisplaySGPA() {
        const sgpaValue = document.getElementById('sgpaValue');

        if (sgpaValue) {
            let totalCredits = 0;
            let totalGradePoints = 0;

            courseDetails.forEach(course => {
                const gradeValue = course.grade.toUpperCase();
                const credits = parseInt(course.credits);

                if (!isNaN(credits)) {
                    totalCredits += credits;
                    switch (gradeValue) {
                        case 'O':
                            totalGradePoints += 10 * credits;
                            break;
                        case 'A+':
                            totalGradePoints += 9 * credits;
                            break;
                        case 'A':
                            totalGradePoints += 8 * credits;
                            break;
                        case 'B+':
                            totalGradePoints += 7 * credits;
                            break;
                        case 'B':
                            totalGradePoints += 6 * credits;
                            break;
                        case 'C':
                            totalGradePoints += 5 * credits;
                            break;
                        case 'P':
                            totalGradePoints += 4 * credits;
                            break;
                        case 'F':
                            totalGradePoints += 0 * credits;
                            break;
                        default:
                            // Invalid grade
                            break;
                    }
                }
            });

            const sgpa = totalCredits !== 0 ? totalGradePoints / totalCredits : 0;
            sgpaValue.textContent = sgpa.toFixed(2);
        } else {
            console.error("SGPA display element not found");
        }
    }

    function calculateAndDisplayCGPA() {
        const cgpaValue = document.getElementById('cgpaValue');
    
        if (cgpaValue) {
            const totalSGPA = parseFloat(document.getElementById('sgpaValue').textContent);
            const totalSemesters = 1; // Just for now, calculating CGPA for the current semester
    
            const cgpa = totalSemesters !== 0 ? totalSGPA / totalSemesters : 0;
            cgpaValue.textContent = cgpa.toFixed(2);
        } else {
            console.error("CGPA display element not found");
        }
    }
    

    function generatePDF() {
    // Get student name, exam month, exam year, and year of registration from the form
    const studentName = document.getElementById('studentName').value;
    const examMonth = document.getElementById('examMonth').value;
    const examYear = document.getElementById('examYear').value;
    const registrationYear = document.getElementById('registrationYear').value;

    // Get other required elements
    const sgpaDisplay = document.getElementById('sgpaDisplay');
    const cgpaDisplay = document.getElementById('cgpaDisplay');
    const gradeCard = document.getElementById('gradeCard');

    // Check if all elements are present and have content
    if (!sgpaDisplay || !cgpaDisplay || !gradeCard || courseDetails.length === 0) {
        console.error("Required elements for PDF generation not found or data missing");
        return;
    }

    // Create a new HTML template for PDF content with margins
    const pdfContent = `
        <div style="margin: 0.5in;">
        <h2 style="text-align: center;">Grade Card</h2>
            <table style="margin: auto;">
                <tr>
                    <td>Student Name:</td>
                    <td>${studentName}</td>
                </tr>
                <tr>
                    <td>PRN:</td>
                    <td>${studentDetails['prn']}</td>
                </tr>
                <tr>
                    <td>Seat No:</td>
                    <td>${studentDetails['seat']}</td>
                </tr>
                <tr>
                    <td>Year:</td>
                    <td>${studentDetails['year']}</td>
                </tr>
                <tr>
                    <td>Semester:</td>
                    <td>${studentDetails['semester']}</td>
                </tr>
                <tr>
                    <td>Exam Month:</td>
                    <td>${examMonth}</td>
                </tr>
                <tr>
                    <td>Exam Year:</td>
                    <td>${examYear}</td>
                </tr>
                <tr>
                    <td>Year of Registration:</td>
                    <td>${registrationYear}</td>
                </tr>
            </table>
        </div>
        <div style="margin: 0.5in;">
            ${gradeCard.outerHTML}
        </div>
        <div style="margin: 1in; text-align: center;">
            <table style="margin: 0.5in;">
                <tr>
                    <td>SGPA</td>
                    <td>CGPA</td>
                </tr>
                <tr>
                    <td>${sgpaDisplay.textContent}</td>
                    <td>${cgpaDisplay.textContent}</td>
                </tr>
            </table>
        </div>
    `;

    // Create a new window and write the PDF content
    const newWindow = window.open('', '_blank');
    newWindow.document.write(pdfContent);
}

    
    
});

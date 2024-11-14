document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date();
    const calendarElement = document.getElementById('calendar');
    const formElement = document.querySelector('form');

    function generateCalendar() {
        const monthDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startDay = firstDay.getDay();

        const adjustedStartDay = (startDay === 0) ? 6 : startDay - 1;

        let calendarHTML = '<div class="calendar-header">';
        calendarHTML += `<button id="prev-month" class="calendar-nav">←</button>`;
        calendarHTML += `<span class="calendar-month">${currentDate.toLocaleString('pl-PL', { month: 'long' })} ${currentDate.getFullYear()}</span>`;
        calendarHTML += `<button id="next-month" class="calendar-nav">→</button>`;
        calendarHTML += '</div>';

        calendarHTML += '<ul class="calendar-days">';
        const daysOfWeek = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];
        daysOfWeek.forEach(day => {
            calendarHTML += `<li class="calendar-day-name">${day}</li>`;
        });
        calendarHTML += '</ul>';

        calendarHTML += '<ul class="calendar-days">';
        let currentRowDays = 0;

        for (let i = 0; i < adjustedStartDay; i++) {
            calendarHTML += '<li class="calendar-day empty disabled"></li>';
            currentRowDays++;
        }

        for (let day = 1; day <= monthDays; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = date.toDateString() === new Date().toDateString();
            const isFuture = date >= new Date();
            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            calendarHTML += `<li class="calendar-day ${isToday ? 'today' : ''} ${!isFuture ? 'disabled' : ''}" data-date="${dateStr}">${day}</li>`;

            currentRowDays++;

            if (currentRowDays === 7) {
                calendarHTML += '</ul><ul class="calendar-days">';
                currentRowDays = 0;
            }
        }

        const emptyCellsCount = 7 - currentRowDays;
        if (emptyCellsCount < 7) { 
            calendarHTML += '<li class="calendar-day empty disabled"></li>'.repeat(emptyCellsCount);
        }

        calendarHTML += '</ul>';
        calendarElement.innerHTML = calendarHTML;

        document.getElementById('prev-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar();
        });
    }

    calendarElement.addEventListener('click', function(e) {
        const clickedDay = e.target;
        if (clickedDay.classList.contains('calendar-day') && !clickedDay.classList.contains('empty') && !clickedDay.classList.contains('disabled')) {
            document.querySelectorAll('.calendar-day').forEach(day => {
                day.classList.remove('selected');
            });
            clickedDay.classList.add('selected');
            document.querySelector('#selected-date').value = clickedDay.dataset.date;
        }
    });

    generateCalendar();
});

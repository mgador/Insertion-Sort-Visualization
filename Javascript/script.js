/*  Checks if the elements inside the array is a number */
function isAllNumber(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == '' || isNaN(arr[i])) {
            if (arr[i] == 0) {
                continue;
            }
            return false
        }
    }
    return true;
}

$(document).ready(function () {



    function isObjectEqual(obj1, obj2) {
        // Implement your custom comparison logic here
        // For example, compare specific properties of the objects
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    function isObjectInArray(obj, arr) {
        return arr.some((item) => isObjectEqual(item, obj));
    }


    /* Visualize button is clicked */
    $("#submitList").click(function () {
        let currentStep = 0;
        let dataset = [];
        let sortSteps = [];
        let dataLength = 0;

        let userInput = $('#listInput').val(); // Get the user input
        // Check if the user input is empty
        if (userInput == '') {
            alert("Enter a list of numbers (separate them using commas).");
        } else {
            // Turn user input into an array and split the elements by commas
            dataset = userInput.split(',');
            // Convert the elements of the list from strings to Numbers
            dataset = dataset.map(function (str) {
                return Number(str);
            });
            dataLength = dataset.length;
            if (isAllNumber(dataset)) {
                if (dataLength >= 8 && dataLength <= 20) {
                    let highestNumber = Math.max(...dataset);
                    const width = (dataLength * 100);
                    const height = (highestNumber * 20);
                    const barWidth = width / dataset.length;
                    const svg = d3.select("#chart")
                        .attr("width", width)
                        .attr("height", height);

                    const renderBars = (data, j) => {
                        const bars = svg.selectAll("rect")
                            .data(data);

                        bars.enter()
                            .append("rect")
                            .merge(bars)
                            .attr("x", (d, i) => i * barWidth)
                            .attr("y", (d) => height - d * 20)
                            .attr("width", barWidth - 1)
                            .attr("height", (d) => d * 20)
                            .attr("fill", (d, i) => {
                                if (i == j) {
                                    return "orange";
                                } else if (i == j - 1) {
                                    return "green";
                                }
                                else {
                                    return "steelblue";
                                }
                            });

                        bars.exit().remove();

                        const labels = svg.selectAll("text")
                            .data(data);

                        labels.enter()
                            .append("text")
                            .merge(labels)
                            .attr("x", (d, i) => i * barWidth + barWidth / 2)
                            .attr("y", (d) => height - d * 20 + 15)
                            .text((d) => d)
                            .style("color", "#EA906C")
                            .style("font-weight", "bold")

                        labels.exit().remove();
                    };

                    for (let i = 1; i < dataLength; i++) {
                        let j = i;
                        sortSteps.push({ array: [...dataset], index: j })
                        while (j > 0 && dataset[j - 1] > dataset[j]) {
                            // Swap elements
                            const temp = dataset[j];
                            dataset[j] = dataset[j - 1];
                            dataset[j - 1] = temp;
                            j--;
                            sortSteps.push({ array: [...dataset], index: j })
                        }
                    }
                    $('#chartContainer').removeClass('d-none');
                    renderBars(sortSteps[currentStep].array, sortSteps[currentStep].index);

                    $("#next").click(function () {
                        if (currentStep < sortSteps.length - 1) {
                            currentStep++;
                            renderBars(sortSteps[currentStep].array, sortSteps[currentStep].index);
                        }
                    })

                    $("#prev").click(() => {
                        if (currentStep > 0) {
                            currentStep--;
                            renderBars(sortSteps[currentStep].array, sortSteps[currentStep].index);
                        }
                    })
                } else {
                    alert("Enter a list of 8-20 numbers.");
                }
            } else {
                alert("Enter numbers only.");
            }
        }
    });
});
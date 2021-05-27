$(function(){

    var chart_years = 10;
    var years = 5;
    var monthes = 12 * years;
    var per_max = 28.0;
    // grab data
    $.ajax({
        url: "https://www.quandl.com/api/v3/datasets/MULTPL/SP500_PE_RATIO_MONTH.json?api_key=qLBCMHr3eDk3x2mMcvnG",
        dataType: "json",
        success: callback,
        error: function(err) {
            alert("Oops there was an error");
        }
    });
    
    // handle data
    function callback(response) {
        var table = $('<table class="tbl"></table>'); 
        
        var columns = response['dataset']['column_names'];
        var data = response['dataset']['data'];
        var head = $('<tr></tr>');

        for(i=0; i < columns.length; i++){ 
            var item = $('<th></th>').text(columns[i]);
            head.append(item); 
        }
        var item2 = $('<th></th>').text("AVG.");
        head.append(item2);
        table.append(head);
        
        var move_sum = 0;
        var cnt = 0;
        var move_avg = [];
        var fifo = [];

        for(var x=data.length-1;x>=0;x--){
            fifo.push(data[x][1]);
            if (fifo.length >= monthes) {
                var avg = calc_avg(fifo);
                move_avg.unshift(avg);
                fifo.shift();
            } else {
                move_avg.unshift(0);
            }
        }


        for(var j=0;j<data.length;j++){
            var row = $('<tr></tr>');
                
            for(var k=0;k<data[j].length;k++){
                var item = $("<td></td>");
                item.text(data[j][k]);
                row.append(item);
            }

            var item2 = $("<td></td>")
            item2.text(move_avg[j]);
            row.append(item2);

            //
            data[j].push(move_avg[j]);
            //

            table.append(row);
        }
        $('body').append(table);
        $(".tbl").fadeOut();
        styleIt();
        
        var last_months = data.slice(0,chart_years * 12);
        drawChart(last_months);
        $("#show-table").fadeIn();
    }
    
    function styleIt() {
        $("td, th").css({
            "font-size":"12px",
            "text-align":"left",
            "border":"1px solid black",
            "padding":"0 4px"
        });
        $(".tbl").css({
            "border-collapse":"collapse",
        });
        $("th").css("font-size","14px")
    }
    
    function drawChart(data){
        var dates =[];
        var values = [];
        var values2 = [];
        for(var i=0;i<data.length;i++){
            dates.unshift(data[i][0]);
            values.unshift(data[i][1]);
            values2.unshift(data[i][2]);

        }
        //console.log(values)
        new Chart($("#line-chart"), { 
            type: 'line', 
            data: { 
                labels: dates, 
                datasets: [
                    {
                        data: values, 
                        label: "S&P500 PE Ratio", 
                        borderColor: "blue"
                    },
                    {
                        data: values2, 
                        label: "S&P500 PE Ratio avg.", 
                        borderColor: "orange"
                    }
                ]
            },
            options: {
                elements: {
                    line: {
                        tension: 0,
                    }
                }
            }
        
        });
    }
    
    var hid = true;
    
    $("#show-table").click(function(){
        hid = !hid;
        if(hid) {
            $(".tbl").fadeOut();
        }
        else {
            $(".tbl").fadeIn();
        }
    });

    function calc_avg(arry) {
        var sum = 0.0;
        for (var k = 0; k < arry.length; k++) {
            var per = parseFloat(arry[k]);
            if (per > per_max) {
                per = per_max;
            }
            sum += per;
        }
        var result = Math.floor(sum / arry.length * 100) / 100;
        return result;
    }


});
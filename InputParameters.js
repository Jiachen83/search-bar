import { useEffect, useState } from "react";
import { Container, Dropdown, Grid, Segment , Input,Button,Table,Form,Pagination} from "semantic-ui-react";
import { DateRangePicker } from 'react-dates';
import moment from "moment";



//API-metric
async function getData(url = ""){
	const response = await fetch(url,{
		method:"GET",
		cache:"no-cache"
	});
	
	return response.json();
}



async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw response.json();
    }
}






// resrestaurant
const restaurantData = [
	{
		"Id": 1,
		"Name": "Restaurant 1 - Greystone",
		"Address": "8553 Greystone Street",
		"City": "Cantonment",
		"State": "FL",
		"Zipcode": "32533"
	},
	{
		"Id": 2,
		"Name": "Restaurant 2 - Whitemarsh",
		"Address": "9927 Whitemarsh Drive",
		"City": "Schenectady",
		"State": "NY",
		"Zipcode": "12302"
	},
	{
		"Id": 3,
		"Name": "Restaurant 3 - Edgewood",
		"Address": "51 Edgewood Lane",
		"City": "Shrewsbury",
		"State": "MA",
		"Zipcode": "01545"
	},
	{
		"Id": 4,
		"Name": "Restaurant 4 - Cedar",
		"Address": "265 Cedar Swamp St.",
		"City": "Lemont",
		"State": "IL",
		"Zipcode": "60439"
	},
	{
		"Id": 5,
		"Name": "Restaurant 5 - Canterbury",
		"Address": "9594 Canterbury Lane",
		"City": "Mobile",
		"State": "AL",
		"Zipcode": "36605"
	},
	{
		"Id": 6,
		"Name": "Restaurant 6 - Jennings",
		"Address": "7508 Jennings Circle",
		"City": "Henderson",
		"State": "KY",
		"Zipcode": "42420"
	},
	{
		"Id": 7,
		"Name": "Restaurant 7 - Dogwood",
		"Address": "9195 Dogwood Lane",
		"City": "Clifton Park",
		"State": "NY",
		"Zipcode": "12065"
	},
	{
		"Id": 8,
		"Name": "Restaurant 8 - Hamilton",
		"Address": "477B Hamilton Lane",
		"City": "Moses Lake",
		"State": "WA",
		"Zipcode": "98837"
	},
	{
		"Id": 9,
		"Name": "Restaurant 9 - Pleasant",
		"Address": "700 Pleasant Drive",
		"City": "Copperas Cove",
		"State": "TX",
		"Zipcode": "76522"
	},
	{
		"Id": 10,
		"Name": "Restaurant 10 - James",
		"Address": "8902 James Court",
		"City": "Lakewood",
		"State": "NJ",
		"Zipcode": "08701"
	}
];

function InputParameters() {
	const restaurantOptions = restaurantData.map(restaurant => ({
	  key: restaurant.Id,
	  text: restaurant.Name,
	  value: restaurant.Id,
	}));

const [restaurantIds, setRestaurantIds] = useState([]);

function findRestaurantName(restaurantId)
{
    const restaurant = restaurantData.find(r => r.Id === restaurantId);

    return restaurant.Name;
}





//time
// Helper function to generate options for time dropdowns
const generateTimeOptions = (startHour, endHour) => {
  const options = [];

  for (let i = startHour; i <= endHour; i++) {
    let hourStr = `${i}`.padStart(2, "0");
    options.push({
      key: hourStr,
      text: `${hourStr}:00`,
      value: i,
    });
  }

  return options;
};

const [startTime, setStartTime] = useState(5);
const [endTime, setEndTime] = useState(29); // Representing 5am next day as 29th hour
const timeOptions = generateTimeOptions(5, 28); // Generate options for 24-hour period  




//date
  const [startDate, setStartDate] = useState(moment("2-1-2023"));
  const [endDate, setEndDate] = useState(moment("2-20-2023"));
  const [focusedInput, setFocusedInput] = useState(null);
  
  console.log(startDate);
  console.log(endDate);




//compare
const initialCompareOptions = [  {key: 'Equal', text: '=', value: 'Equal'},  {key: 'LessThanOrEqual', text: '<=', value: 'LessThanOrEqual'},  {key: 'LessThan', text: '<', value: 'LessThan'},  {key: 'GreaterThan', text: '>', value: 'GreaterThan'},  {key: 'GreaterThanOrEqual', text: '>=', value: 'GreaterThanOrEqual'}];




//Metric 
const [metricCriteria, setMetricCriteria] = useState([
  {
      metricCode: "",
      compareType: "",
      value: ""
  }
]);
const [MetricDefinitions,setMetricDefinitions]= useState([]);

useEffect(() => {
	getData("https://customsearchquerytoolapi.azurewebsites.net/Search/MetricDefinitions")
	.then(data => {
		setMetricDefinitions(data);
	})
},[]);

const metricOptions = MetricDefinitions.map(m => {
    return({key: m.metricCode,
    text: m.alias,
    value:  m.metricCode
	})
  });
console.log(MetricDefinitions);


function setMetricCriteriaHelper(index, propertyName, propertyValue)
{
    const metricCriteriaOrig = [...metricCriteria];

    metricCriteriaOrig[index][propertyName] = propertyValue;

    setMetricCriteria(metricCriteriaOrig);
}

function AddMetricCriteria()
{
    const metricCriteriaOld = [...metricCriteria];

    metricCriteriaOld.push({
        metricCode: "",
        compareType: "",
        value: ""
    })

    setMetricCriteria(metricCriteriaOld);
}

console.log(metricCriteria);
















// fomat
const formatMetricValue = (value, metricDefinitions,metricCode ) => {
  let formattedValue = value;
  const metricDefinition = metricDefinitions.find(m => m.metricCode === metricCode);
  const dataType = metricDefinition.dataType
  const decimalPlaces= metricDefinition.decimalPlaces

  if (dataType === "Percent") {
    formattedValue = `${Number(value * 100).toFixed(decimalPlaces)}%`;
  } else if (dataType === "Money") {
    formattedValue = `$${Number(value).toFixed(decimalPlaces)}`;
  } else if (dataType === "Number") {
    formattedValue = Number(value).toFixed(decimalPlaces);
  } 
  return formattedValue;
}






//submitForm
const [posData, setPost] = useState([]);

  function submitForm()
  {
	  console.log("Form submitted!"); 

  const inputParamaters = {
	restaurantIds: restaurantIds,
	fromDate: startDate,
	toDate: endDate,
	fromHour: startTime,
	toHour: endTime,
  metricCriteria: metricCriteria.map(m => {
    return ({
        metricCode: m.metricCode,
        compareType: m.compareType,
        value: Number(m.value)
    })
})
}

postData("https://customsearchquerytoolapi.azurewebsites.net/Search/Query",inputParamaters)
.then(data => {
  setPost(data);
})
console.log(posData);
console.log(inputParamaters);
}







//Pagination
const pageSize = 20;
const [page, setPage] = useState(0);
const start = page * pageSize;
const end = (page + 1) * pageSize;




  return (
    <Grid>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Container className="Container">
            <Segment className="Segment">
              <Grid centered>
                <Grid.Row columns="1">
                  <Grid.Column textAlign="center">
                    <h1>Custom Search Query Tool</h1>
                    </Grid.Column>
                      </Grid.Row>
				                <Grid.Row>
				            <Form onSubmit={() => submitForm()}>
                      <Form.Field>
                    <Dropdown
                    placeholder="Select restaurant(s)..."
                    fluid
                    multiple
                    selection
                    options={restaurantOptions}
                    value={restaurantIds}
                    onChange={(e, data) => setRestaurantIds(data.value)}
                    />
                    </Form.Field>
                  <Form.Field>
				            <h3>From</h3>
                    <Dropdown
                      placeholder="Select start time..."
                      fluid
                      selection
                      options={timeOptions}
                      value={startTime}
                      onChange={(e, data) => setStartTime(data.value)}
                    />
                  </Form.Field>
                    <Form.Field>
				            <h3>To</h3>
                    <Dropdown
                      placeholder="Select end time..."
                      fluid
                      selection
                      options={timeOptions}
                      value={endTime}
                      onChange={(e, data) => setEndTime(data.value)}
                    />
                  </Form.Field>
                    <Form.Field>
				            <h3>Metric</h3>
                    {metricCriteria.map((m, index) => {
                                                return (<Dropdown
                                                    placeholder='Select metric...'
                                                    fluid
                                                    selection
                                                    options={metricOptions}
                                                    value={m.metricCode}
                                                    onChange={(e, data) => setMetricCriteriaHelper(index, "metricCode", data.value)}
                                                />);
                                            })}
                      </Form.Field>
                      <Form.Field>
				              <h3>Compare</h3>
                      {metricCriteria.map((m, index) => {
                                                return (<Dropdown
                                                    placeholder="Select Compare option..."
                                                    fluid
                                                    selection
                                                    options={initialCompareOptions}
                                                    value={m.compareType}
                                                    onChange={(e, data) => setMetricCriteriaHelper(index, "compareType", data.value)}
                                                />);
                                            })}
				              </Form.Field>
                    <Form.Field>
				              <h3>Value</h3>
                      {metricCriteria.map((m, index) => {
                                                return (<Input
                                                    placeholder="Enter a numeric value"
                                                    type="number"
                                                    
                                                    value={m.value}
                                                    onChange={(e, data) => setMetricCriteriaHelper(index, "value", data.value)}
                                                />);
                                            })}
				              </Form.Field>
                    <Form.Field>
				              <h3>Date range</h3>
				            <DateRangePicker
                    isOutsideRange={(day) => {
                      if (day >= moment("2021-10-01") && day <= moment("2021-10-26")) {
                          return false;
                      } else {
                          return true;
                      }
                  }}
                    startDate={startDate} // momentPropTypes.momentObj or null,
                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                    endDate={endDate} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                    onDatesChange={({ startDate, endDate }) => {
                                        setStartDate(startDate);
                                        setEndDate(endDate);
                                    }} // PropTypes.func.isRequired,
                    focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={focusedInput => setFocusedInput(focusedInput)} // PropTypes.func.isRequired,
                     />
				            </Form.Field>
                        <Form.Field>
                         <Button color="blue" type="submit">
                          Submit
                           </Button>
                            </Form.Field>
                               </Form>    
                                </Grid.Row>
                                <Button  onClick={() => AddMetricCriteria()}>
                                        Add metricCriteria to table
                                    </Button>
                                <Grid.Row >
                                    <h3>Results</h3>
                                    <Table>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>
                                                    Restaurant Name
                                                </Table.HeaderCell>
                                                <Table.HeaderCell>
                                                    Order Date
                                                </Table.HeaderCell>
                                                {MetricDefinitions.map(m => {
                                                    return <Table.HeaderCell>
                                                        {m.alias}
                                                    </Table.HeaderCell>
                                                })}
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {posData.slice(start, end).map(m => {
                                         return <Table.Row>
                        <Table.Cell>{ findRestaurantName(m.restaurantId) }</Table.Cell>
                          <Table.Cell>{m.busDt}</Table.Cell>
                          <Table.Cell>{formatMetricValue(m.totalAmount,MetricDefinitions,"TotalAmount")}</Table.Cell>
                           <Table.Cell>{formatMetricValue(m.netAmount,MetricDefinitions,"NetAmount")}</Table.Cell>
                            <Table.Cell>{m.itemSoldQty}</Table.Cell>
                            <Table.Cell>{m.beverageQty}</Table.Cell>
                            <Table.Cell>{formatMetricValue(m.discountAmount,MetricDefinitions,"DiscountAmount")}</Table.Cell>
                             <Table.Cell>{formatMetricValue(m.discountRatio,MetricDefinitions,"DiscountRatio")}</Table.Cell>
                              <Table.Cell>{formatMetricValue(m.itemDeletedAmount,MetricDefinitions,"ItemDeletedAmount")}</Table.Cell>
                            <Table.Cell>{formatMetricValue(m.refundAmount,MetricDefinitions,"RefundAmount")}</Table.Cell> 
                                          </Table.Row>})}
                                           </Table.Body>
                                    </Table>
                                    <Pagination
                                            totalPages={Math.ceil(posData.length / pageSize)}
                                            activePage={page + 1}
                                            onPageChange={(e, { activePage }) => setPage(activePage - 1)}
                                          />     
                                                    </Grid.Row>
                                                  </Grid>
                                              </Segment>
                                            </Container>
                                          </Grid.Column>
                                        </Grid.Row>
                                      </Grid>
                                    );
                                  }

export default InputParameters;

import React, { useState } from 'react'
import { Button, TextField, Modal, Grid } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { FormControl, MenuItem, Select, InputLabel } from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import data from '../data/data'

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    err: {
        position: 'absolute',
        width: 400,
        height: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    input: {
        "&:invalid": {
            border: "red solid 2px"
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
}));

const getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        position: 'absolute',
        overflow: 'scroll',
        height: '100%',
        display: 'block'
    };
}

const getModalStyleErr = () => {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        position: 'absolute'
    };
}

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'table', headerName: 'Tên Bảng', width: 150 },
    { field: 'task', headerName: 'Tên Task', width: 150 },
    { field: 'day', headerName: 'Ngày', width: 150 },
    { field: 'hours', headerName: 'Giờ', width: 150 },
    { field: 'target', headerName: 'Mục Tiêu', width: 150 },
    { field: 'estimated', headerName: 'Hoàn Thành Dự Kiến', width: 250 },
    { field: 'rate', headerName: 'Hoàn Thành Thực Tế', width: 250 },
    { field: 'note', headerName: 'Ghi Chú', width: 300 }
];

const Home = () => {

    const [open, setOpen] = useState(false)
    const [rate, setRate] = useState("")
    const [estimated, setEstimated] = useState("")
    const [list, setList] = useState(data)
    const [dataTemp, setDataTemp] = useState({
        table: "",
        task: "",
        day: "",
        hours: "",
        target: "",
        estimated: 0,
        rate: 0,
        note: ""
    });

    const [selectedDay, setSelectedDay] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [err, setErr] = useState(false)

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [modalStyleErr] = useState(getModalStyleErr);

    const onHandleOpen = () => {
        setOpen(true)
    }

    const onHandleClose = () => {
        setOpen(false)
    }

    const onHandleCloseErr = () => {

        setErr(false)
    }

    const onHandleData = () => {

        if (dataTemp.hours === "") {
            dataTemp.hours = new Intl.DateTimeFormat('UTC', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
        }

        if (dataTemp.day === "") {

            const date = new Date()
            const hours = date.getHours()
            const minutes = date.getMinutes()

            dataTemp.day = hours + ':' + minutes
        }

        // if (!isNaN(Number(dataTemp.rate))) {
        //     onHandleEstimated(dataTemp.rate)
        // }

        // if (!isNaN(Number(dataTemp.estimated))) {
        //     onHandleRate(dataTemp.estimated)
        // }

        if (dataTemp.table === "" || dataTemp.task === "" || dataTemp.target === "" || dataTemp.note === "" || dataTemp.rate === 0 || dataTemp.estimated === 0) {
            // setErr(true)
        } else {
            const count = list.length
            dataTemp.id = count + 1
            setList([...list, dataTemp])
            onHandleClose()
        }
    }

    const handleDayChange = (date) => {
        setSelectedDay(date);
        setDataTemp({ ...dataTemp, day: new Intl.DateTimeFormat('UTC', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date) })
    };

    const handleTimeChange = (date) => {

        setSelectedTime(date);

        const hours = date.getHours()
        const minutes = date.getMinutes()

        setDataTemp({ ...dataTemp, hours: hours + ':' + minutes })
    };

    const onHandleEstimated = (e) => {
        if (!isNaN(Number(e))) {
            if (e >= 0 && e <= 100) {
                setDataTemp({ ...dataTemp, estimated: e })
                setEstimated(e)
                // setErr(false)
            } else {
                // setErr(true)
            }
        }
    }

    const onHandleRate = (e) => {

        if (!isNaN(Number(e))) {
            if (e >= 0 && e <= 100) {
                setDataTemp({ ...dataTemp, rate: e })
                setRate(e)
                // setErr(false)
            } else {
                // setErr(true)
            }
        }

    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Thêm task</h2>
            <div id="simple-modal-description">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Tên Bảng</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={dataTemp.table}
                                onChange={(e) => setDataTemp({ ...dataTemp, table: e.target.value })}
                            >
                                <MenuItem value="chatbot">Chat Bot</MenuItem>
                                <MenuItem value="monitor">Monitoring System</MenuItem>
                                <MenuItem value="idea &amp; Design">Idea &amp; Design</MenuItem>
                                <MenuItem value="cicdsec">CI/CD Security</MenuItem>
                                <MenuItem value="training">Training</MenuItem>
                                <MenuItem value="blog">Blog</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField onChange={(e) => setDataTemp({ ...dataTemp, task: e.target.value })} id="task" label="Task" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Ngày"
                                format="MM/dd/yyyy"
                                value={selectedDay}
                                onChange={handleDayChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                label="Giờ"
                                ampm={false}
                                value={selectedTime}
                                onChange={handleTimeChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField onChange={(e) => setDataTemp({ ...dataTemp, target: e.target.value })} id="target" label="Mục Tiêu" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField onChange={(e) => onHandleEstimated(e.target.value)}
                            value={dataTemp.estimated === 0 ? estimated : dataTemp.estimated}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                            id="estimated" label="Hoàn Thành Dự Kiến"
                            variant="outlined"
                            inputProps={{ className: classes.input, pattern: "^(100|[0-9]{1,2})%?$" }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={dataTemp.rate === 0 ? rate : dataTemp.rate}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                            onChange={(e) => onHandleRate(e.target.value)}
                            id="rate" variant="outlined"
                            label="Hoàn Thành Thực Tế"
                            inputProps={{ className: classes.input, pattern: "^(100|[0-9]{1,2})%?$" }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField onChange={(e) => setDataTemp({ ...dataTemp, note: e.target.value })} id="note" label="Ghi Chú" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={() => onHandleData()} variant="contained" color="secondary">
                            Thêm
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    )

    const errModal = (
        <div style={modalStyleErr} className={classes.err}>
            <h2 id="simple-modal-title">Err</h2>
            <div id="simple-modal-description">
                <Alert variant="outlined" severity="error">
                    <p>Có lỗi xảy ra!</p>
                </Alert>
                <Button onClick={() => onHandleCloseErr()} variant="contained" color="secondary">
                    Close
                </Button>
            </div>
        </div>
    )

    return (
        <Grid direction="row" justify="flex-start" alignItems="center" container spacing={3}>

            <Grid item style={{ marginTop: '1em', marginLeft: '1em' }}>
                <Button variant="contained" color="secondary" onClick={onHandleOpen}>
                    Thêm task
                </Button>
            </Grid>

            <Modal
                open={open}
                onClose={onHandleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>


            <Modal
                open={err}
                onClose={onHandleCloseErr}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {errModal}
            </Modal>


            <Grid item xs={12}>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={list} columns={columns} pageSize={5} checkboxSelection onRowSelected={e => console.log(e)} />
                </div>
            </Grid>

        </Grid>
    )
}

export default Home

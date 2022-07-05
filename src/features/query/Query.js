import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';
import Box from "@mui/material/Box";
import {nanoid} from '@reduxjs/toolkit';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useDispatch, useSelector} from 'react-redux'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import './Query.css'

const testFilterData = [{tagKey: '战区', tagVal: '东部战区'}, {tagKey: '战区', tagVal: '西部战区'}, {
    tagKey: '面积', tagVal: '400m2'
}, {tagKey: '梯户比', tagVal: '2T4'},]

function FilterTag(props) {
    // 顶部可删除标签
    // 标签分类名：标签
    // todo:onFocus endicon变红
    const handleClick = () => {
        // 销毁， 更新redux-store,将该元素删除
        console.group("更新标签")
        console.log(`${props.tagVal} has been deleted`)
        console.groupEnd()
    }

    return (<Button
        variant={`outlined`}
        endIcon={<CloseIcon sx={{color: 'red'}}/>}
        onClick={handleClick}
        sx={{
            backgroundColor: '#f3f3f3',
            borderTopColor: '#6c757d',
            borderBottomColor: '#6c757d',
            borderLeftColor: '#6c757d',
            borderRightColor: '#6c757d',
            borderRadius: '0 0',
            marginRight: '5px',
            ":hover": {
                borderTopColor: 'red', borderBottomColor: 'red', borderLeftColor: 'red', borderRightColor: 'red',
            }
        }}
        size={'small'}
    >
        <Typography variant={`body2`} sx={{color: '#212529'}}>
            {props.tagKey}:
        </Typography>
        <Typography variant={`body2`} sx={{color: 'red'}}>
            {props.tagVal}
        </Typography>
    </Button>)
}

function ChoiceTag(props) {
    // 是否多选
    const [isMulti, setIsMulti] = useState(props.isMulti)
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        setIsMulti(props.isMulti)
    }, [props.isMulti])

    const dispatch = useDispatch()
    const handleChange = (e) => {
        console.group("Handle change")
        console.log(e.target.checked)
        if (isMulti) {
            // 如果多选，添加入store
            setChecked(e.target.checked)
        }
        console.groupEnd()
    }

    return (<FormControlLabel control={<Checkbox sx={{visibility: isMulti ? 'display' : 'hidden'}}/>}
                              label={<Typography variant={`body2`} sx={{color: '#0070C0'}}>
                                  {props.tagVal}
                              </Typography>}
                              checked={checked}
                              onChange={(e) => handleChange(e)}
        />

    )
}


function ChoiceContainer(props) {

    const [multiple, setMultiple] = useState('')
    const handleClick = () => {
        setMultiple('multiple')
    }

    const handleFocus = () => {

    }
    return (<Box component={`div`}>

        <Box className={`sl-wrap ${multiple}`} component={`div`}>
            <Box className={`sl-key`} component={`div`}>
                <strong>
                    {props.verboseName}
                </strong>
            </Box>
            <Box className={`sl-value`} component={`div`}>
                <Box className={`sl-v-list`} component={`div`}>
                    {props.options.map(option => (
                        <ChoiceTag key={option.id} tagVal={option.tagVal} isMulti={multiple === 'multiple'}/>))}
                </Box>
                <Box className={`sl-btns`}>
                    <Button className={`J_btnsConfirm`} color={`primary`} variant={`contained`} size={`small`}>
                        确认
                    </Button>
                    <Button className={`J_btnsCancel`} color={`primary`} variant={`contained`} size={`small`}>
                        取消
                    </Button>
                </Box>
            </Box>
            <Box className={`sl-ext`} compoent={`div`}
                 sx={{
                     visibility: multiple === 'multiple' ? 'hidden' : 'visible'
                 }}
            >
                <a className={`sl-e-multiple J_extMultiple`} onClick={handleClick} onFocus={handleFocus}>
                    多选
                    <i></i>
                </a>
            </Box>
        </Box>
    </Box>)
}


export default function Query() {
    // 顶部标签栏
    const renderSelectedChoices = testFilterData.map(tag => (
        <FilterTag key={nanoid()} tagKey={tag.tagKey} tagVal={tag.tagVal}/>))
    const queries = useSelector(state => state.query)
    // frame
    const renderChoices = queries.categories.map(query => (
        query.tags.map(q => (
            <ChoiceContainer key={q.id} {...q}/>
        ))

    ))


    return (<React.Fragment>
            <Box sx={{border: '1px solid', padding: '10px'}}>
                <React.Fragment>
                    <Breadcrumbs
                        component={`div`}
                        separator={<NavigateNextIcon fontSize="small"/>}
                        aria-label="breadcrumb"
                    >
                        <Typography variant={`body2`}>
                            {`全部结果(相当于reset) > `}
                        </Typography>
                        <div>
                            {renderSelectedChoices}
                        </div>
                    </Breadcrumbs>
                </React.Fragment>
                <React.Fragment>
                    <Box className={`selector`} component={`div`}>
                        {renderChoices}
                    </Box>
                </React.Fragment>
            </Box>
        </React.Fragment>

    )

}
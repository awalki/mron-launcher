import { useDispatch, useSelector } from 'react-redux'
import {
	decrement,
	increment,
	incrementByAmount,
} from '../state/counter/counterSlice'
import { RootState } from '../state/store'

export default function Counter() {
	const count = useSelector((state: RootState) => state.counter.value)
	const dispatch = useDispatch()

	return (
		<div>
			<h2>{count}</h2>
			<div>
				<button onClick={() => dispatch(increment())}>Increment</button>
				<button onClick={() => dispatch(incrementByAmount(10))}>
					Increment by amount
				</button>
				<button onClick={() => dispatch(decrement())}>Decrement</button>
			</div>
		</div>
	)
}

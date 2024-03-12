import DateTimeDisplay from "@/Components/Countdown/DateTimeDisplay";
import { useCountdown } from "@/Components/Countdown/hooks/useCountdown";
import "./Countdown.scss";

const ExpiredNotice = ({ text }) => {
    return (
        <div className="text-2xl text-red-500">
            <span>{text}</span>
        </div>
    );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="show-counter">
            <div className="countdown-link">
                <DateTimeDisplay value={days} type={"Days"} isDanger={days <= 3} />
                <p>:</p>
                <DateTimeDisplay value={hours} type={"Hours"} isDanger={false} />
                <p>:</p>
                <DateTimeDisplay value={minutes} type={"Mins"} isDanger={false} />
                <p>:</p>
                <DateTimeDisplay value={seconds} type={"Seconds"} isDanger={false} />
            </div>
        </div>
    );
};

const CountdownTimer = ({ targetDate, expiredText}) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        return <ExpiredNotice text={expiredText} />;
    } else {
        return (
            <ShowCounter
                days={days}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
            />
        );
    }
};

export default CountdownTimer;

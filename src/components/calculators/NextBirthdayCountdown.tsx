"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateBirthdayCountdown } from "@/lib/ageUtils";

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
});

interface Props {
    birthMonth: number;
    birthDay: number;
}

function pad(value: number): string {
    return `${value}`.padStart(2, "0");
}

export default function NextBirthdayCountdown({ birthMonth, birthDay }: Props) {
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    const countdown = useMemo(
        () => calculateBirthdayCountdown(birthMonth, birthDay, new Date(currentTime)),
        [birthDay, birthMonth, currentTime]
    );

    useEffect(() => {
        const interval = window.setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <div className="age-countdown-card">
            <div className="age-countdown-grid" aria-live="polite">
                <div className="age-countdown-item">
                    <span>{pad(countdown.months)}</span>
                    <small>Months</small>
                </div>
                <div className="age-countdown-item">
                    <span>{pad(countdown.days)}</span>
                    <small>Days</small>
                </div>
                <div className="age-countdown-item">
                    <span>{pad(countdown.hours)}</span>
                    <small>Hours</small>
                </div>
                <div className="age-countdown-item">
                    <span>{pad(countdown.minutes)}</span>
                    <small>Minutes</small>
                </div>
                <div className="age-countdown-item">
                    <span>{pad(countdown.seconds)}</span>
                    <small>Seconds</small>
                </div>
            </div>

            <p className="age-countdown-note">
                Countdown target: {DATE_TIME_FORMATTER.format(countdown.nextBirthdayDate)}
            </p>
            {countdown.isBirthdayToday && (
                <p className="age-countdown-note">
                    Your birthday is today, so this timer is already counting toward next year.
                </p>
            )}
        </div>
    );
}

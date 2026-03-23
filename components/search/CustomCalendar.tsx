"use client";

import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  isBefore,
  startOfDay,
} from "date-fns";
import { fr } from "date-fns/locale";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface CustomCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export default function CustomCalendar({
  selectedDate,
  onSelectDate,
}: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const today = startOfDay(new Date());

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const onDateClick = (day: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isBefore(day, today)) return;
    onSelectDate(day);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4 px-2">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-neutral-100 transition text-neutral-600"
          type="button"
        >
          <IoChevronBack size={18} />
        </button>
        <span className="text-sm font-bold capitalize text-dark">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-neutral-100 transition text-neutral-600"
          type="button"
        >
          <IoChevronForward size={18} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={i}
          className="text-center text-[10px] font-bold text-neutral-400 uppercase tracking-wider py-2"
        >
          {format(addMonths(startDate, i), "EEEEEE", { locale: fr })}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        const disabled = isBefore(day, today);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            className={`flex justify-center items-center p-1 ${
              !isCurrentMonth ? "invisible" : ""
            }`}
            key={day.toString()}
          >
            <button
              type="button"
              onClick={(e) => onDateClick(cloneDay, e)}
              disabled={disabled}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                ${
                  isSelected
                    ? "bg-primary text-white font-bold shadow-md"
                    : disabled
                    ? "text-neutral-300 cursor-not-allowed"
                    : "text-dark hover:bg-neutral-100 hover:text-primary"
                }
              `}
            >
              {formattedDate}
            </button>
          </div>
        );
        day = new Date(day.getTime() + 24 * 60 * 60 * 1000);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white p-4 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-neutral-100 w-[320px] absolute z-50 top-full mt-4 -left-1/2 md:left-0">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

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
  position?: "top" | "bottom";
}

export default function CustomCalendar({
  selectedDate,
  onSelectDate,
  position = "bottom",
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
      <div className="flex justify-between items-center mb-3 px-1">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 rounded-full hover:bg-neutral-200 transition text-neutral-800"
          type="button"
        >
          <IoChevronBack size={18} />
        </button>
        <span className="text-sm font-black capitalize text-dark">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-1.5 rounded-full hover:bg-neutral-200 transition text-neutral-800"
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
          className="text-center text-[10px] font-black text-neutral-500 uppercase tracking-widest py-1.5"
        >
          {format(addMonths(startDate, i), "EEEEEE", { locale: fr })}
        </div>,
      );
    }

    return <div className="grid grid-cols-7 mb-1">{days}</div>;
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
            className={`flex justify-center items-center p-0.5 ${
              !isCurrentMonth ? "invisible" : ""
            }`}
            key={day.toString()}
          >
            <button
              type="button"
              onClick={(e) => onDateClick(cloneDay, e)}
              disabled={disabled}
              className={`
                w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all
                ${
                  isSelected
                    ? "bg-primary text-white shadow-md border-transparent"
                    : disabled
                      ? "text-neutral-300 cursor-not-allowed"
                      : "text-dark-900 border border-transparent hover:border-neutral-200 hover:bg-neutral-100 hover:text-primary"
                }
              `}
            >
              {formattedDate}
            </button>
          </div>,
        );
        day = new Date(day.getTime() + 24 * 60 * 60 * 1000);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-0.5" key={day.toString()}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className={`bg-white p-3 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-neutral-200 w-[290px] absolute z-60 left-0 ${position === "top" ? "bottom-full mb-3" : "top-full mt-3"}`}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

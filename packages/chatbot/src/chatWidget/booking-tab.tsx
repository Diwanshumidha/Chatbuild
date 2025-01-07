import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import React from "react";
import { useEffect } from "react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "../components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { IoCalendarOutline } from "react-icons/io5";
import { BASE_PATH } from "../lib/constants";

type Event = {
  id: string;
  calendarBookingFunctionId: string;
  eventTypeId: string;
  description: string;
  timePeriodInMinutes: number;
};

const getAvailableTimeSlots = async (
  selectedDate: Date,
  eventTypeId: string,
  apiKey: string
) => {
  // Simulate fetching time slots. Replace with your actual API call.
  // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(selectedDate.toISOString());
  const response = await fetch(
    `${BASE_PATH}/book-meeting?date=${selectedDate.toISOString()}&eventTypeId=${eventTypeId}&apiKey=${apiKey}`
  );
  const data = await response.json();
  if (!response.ok) {
    console.error(
      "[CHATBUILD_AI] There Was an Error While Loading The Time Slots"
    );
    return [];
  }
  if (!data || data.status !== "success" || !data.data?.slots) {
    console.error(
      "[CHATBUILD_AI] There Was an Error While Loading The Time Slots"
    );
    return [];
  }
  const everyDaySlots = data.data.slots as Record<string, { time: string }[]>;
  // const timeSlots = data.data.slots[new Date(selectedDate)]
  const timeSlots = Object.entries(everyDaySlots)[0]?.[1] || [];
  console.log(timeSlots);
  return timeSlots;
};

const getEvents = async (apiKey: string) => {
  try {
    const response = await fetch(
      BASE_PATH + `/get-booking-events?apiKey=${apiKey}`
    );
    if (!response.ok) {
      console.error(
        "[CHATBUILD_AI] There Was an Error While Loading The Events"
      );
      return [];
    }
    const data = await response.json();

    return data.events as Event[];
  } catch (error) {
    return [];
  }
};

type Status =
  | {
      status: "success";
    }
  | {
      status: "error";
      message: string;
    }
  | {
      status: "loading";
    }
  | null;

const BookingTab = ({
  widgetStyles,
  apiKey,
}: {
  widgetStyles: { [key: string]: string };
  apiKey: string;
}) => {
  const [date, setDate] = useState<Date>();
  const [timeSlots, setTimeSlots] = useState<{ time: string }[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventTypeId, setSelectedEventTypeId] = useState<string>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStartTime, setStartSelectedTime] = useState("");
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    const events = getEvents(apiKey);
    events.then((data) => {
      setEvents(data || []);
    });
  }, [apiKey]);
  console.log("events", events);
  // console.log('events', selectedEventTypeId);
  async function fetchTimeSlots(selectedDate: Date) {
    if (!selectedEventTypeId || !selectedDate) return;
    setIsLoadingSlots(true);
    const slots = await getAvailableTimeSlots(
      selectedDate,
      selectedEventTypeId,
      apiKey
    );
    if (slots) {
      setTimeSlots(slots);
    }
    console.log(slots);
    // setTimeSlots(slots);
    setIsLoadingSlots(false);
  }

  const createBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setStatus({ status: "loading" });
      e.preventDefault();
      console.log(
        "Booking",
        name,
        email,
        selectedEventTypeId,
        selectedStartTime
      );
      const response = await fetch(BASE_PATH + `/book-meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          eventTypeId: selectedEventTypeId,
          startTime: selectedStartTime,
          apiKey,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      if (response.ok && response.status === 201) {
        setStatus({ status: "success" });
        setName("");
        setEmail("");
        setSelectedEventTypeId("");
        setStartSelectedTime("");
        setDate(undefined);
        setTimeSlots([]);
      } else {
        setStatus({
          status: "error",
          message: "There was an error while booking the meeting",
        });
      }
    } catch (error) {
      console.log(error);
      setStatus({
        status: "error",
        message: "There was an error while booking the meeting",
      });
    }
  };
  return (
    <div className="booking-form">
      <motion.form
        onSubmit={createBooking}
        className="booking-form__user-details-form cb-space-y-2"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="booking-form__header"
        >
          <h2>Schedule a Meeting</h2>
          <p>Book a time to meet with us</p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key="form-fields"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="cb-space-y-3"
          >
            <motion.div
              className="cb-space-y-2"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name">Name</label>
              <input
                className="chatbot-input"
                id="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Enter your name"
              />
            </motion.div>

            <motion.div
              className="cb-space-y-2"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email">Email</label>
              <input
                className="chatbot-input"
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter your email"
              />
            </motion.div>

            <motion.div
              className="cb-space-y-2"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label>Duration</label>
              <Select
                value={selectedEventTypeId?.toString() || ""}
                onValueChange={(e) => setSelectedEventTypeId(e)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem
                      key={event.id}
                      value={event.eventTypeId.toString()}
                    >
                      {event.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              className="cb-space-y-2"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label>Date</label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    disabled={!selectedEventTypeId}
                    className={cn(
                      "chatbot-button chatbot-button--outline ",
                      !date && "chatbot-button-placeholder-text"
                    )}
                  >
                    <IoCalendarOutline className="icon" />
                    {date ? format(date, "PPP") : "Select date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  style={{...widgetStyles, zIndex: 1000}}
                  className="w-auto p-0"
                  align="start"
                >
                  <Calendar
                    disabled={(date) => date < new Date()}
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setIsCalendarOpen(false);
                      if (newDate) {
                        setStartSelectedTime("");
                        fetchTimeSlots(newDate);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </motion.div>

            <AnimatePresence mode="wait">
              {date && (
                <motion.div
                  key="time-select"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="cb-space-y-2"
                >
                  <label>Time</label>
                  <Select
                    value={selectedStartTime}
                    onValueChange={setStartSelectedTime}
                    disabled={isLoadingSlots}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingSlots
                            ? "Loading available times..."
                            : "Select time"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent style={{ maxHeight: "400px" }}>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.time} value={slot.time}>
                          {format(slot.time, "hh:mm a")}
                        </SelectItem>
                      ))}
                      {!selectedEventTypeId || !date ? (
                        <p style={{ color: "black", padding: "0.5rem" }}>
                          Select a duration and date to view available times
                        </p>
                      ) : null}
                      {!timeSlots.length ? (
                        <p style={{ color: "black", padding: "0.5rem" }}>
                          There is no available time slots for the selected date
                        </p>
                      ) : null}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button
                type="submit"
                className="booking-form__user-details-form__input-wrapper__submit-button"
              >
                {status?.status === "loading" ? "Booking..." : "Book Meeting"}
              </button>
            </motion.div>
            {status?.status === "error" || status?.status === "success" ? (
              <p
                style={{
                  color: status?.status === "error" ? "red" : "green",
                  textAlign: "center",
                  background:
                    status?.status === "error"
                      ? "rgba(255, 0, 0, 0.1)"
                      : "rgba(0, 255, 0, 0.1)",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                }}
              >
                {status?.status === "error" && status.message}
                {status?.status === "success" && "Meeting booked successfully"}
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </motion.form>
    </div>
  );
};

export default BookingTab;

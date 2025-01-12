"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
 
// Define the User type
type User = {
  id: string;
  name: string;
  phone: string;
  date: Date;
  duration: string;
  paymentMethod: string;
  amount: number;
  number: number;
  lastPaidMonth: string;
};

export default function HomePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setdate] = useState(new Date());
  const [duration, setDuration] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const currentDate = new Date();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      date,
      duration,
      paymentMethod,
      amount: Number(amount),
      number: users.length + 1,
      lastPaidMonth: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
    setName("");
    setPhone("");
    setdate(new Date());
    setDuration("");
    setPaymentMethod("");
    setAmount("");
  };

  const isPending = (lastPaidMonth: string) => {
    const lastPaid = new Date(lastPaidMonth);
    const diffMonths =
      (currentDate.getFullYear() - lastPaid.getFullYear()) * 12 +
      (currentDate.getMonth() - lastPaid.getMonth());
    return diffMonths > 0;
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50 px-4">
      <header className="container mx-auto py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gym Management System</h1>
        <ThemeToggle />
      </header>

      <main className="container py-4 md:max-w-none max-w-md">
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register User</TabsTrigger>
            <TabsTrigger value="manage">Manage Users</TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <form
              onSubmit={onSubmit}
              className="space-y-8 max-w-auto  max-w-md  "
            >
              <div>
                <label>Name</label>
                <div>
                  <Input
                    placeholder="Enter the name"
                    value={name}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[<>?]/g, "");
                      setName(sanitized);
                    }}
                  />
                </div>
                <span></span>
              </div>

              <div>
                <label>Phone</label>
                <div>
                  <Input
                    placeholder="Enter the phone number"
                    value={phone}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhone(sanitized);
                    }}
                  />
                </div>
                <span></span>
              </div>

              <div className="flex flex-col">
                <label>Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !date && "text-neutral-500 dark:text-neutral-400"
                        )}
                      >
                        {date ? (
                          format(date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        if (date) setdate(date);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span></span>
              </div>

              <div>
                <label>Duration</label>
                <Select
                  onValueChange={(value) => setDuration(value || "")}
                  value={duration}
                >
                  <div>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Duration" />
                    </SelectTrigger>
                  </div>
                  <SelectContent>
                    <SelectItem value="15 days">15 days</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                  </SelectContent>
                </Select>
                <span></span>
              </div>

              <div>
                <label>Payment Method</label>
                <Select
                  onValueChange={(value) => setPaymentMethod(value || "")}
                  value={paymentMethod}
                >
                  <div>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Payment" />
                    </SelectTrigger>
                  </div>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
                <span></span>
              </div>

              <div>
                <label>Amount</label>
                <div>
                  <Input
                    placeholder="Enter the amount"
                    value={amount}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/\D/g, "");
                      setAmount(sanitized);
                    }}
                  />
                </div>
                <span></span>
              </div>

              <Button
                type="submit"
                variant={
                  !name || !phone || !date || !duration || !paymentMethod || !amount
                    ? "secondary"
                    : "default"
                }
                disabled={
                  !name || !phone || !date || !duration || !paymentMethod || !amount
                }
              >
                Register User
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="manage">
            <Table>
              <TableCaption>
                A list of gym members and their payment status.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead> Date</TableHead>
                  <TableHead>Last Paid Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.number}</TableCell>
                    <TableCell>{format(user.date, "PPP")}</TableCell>
                    <TableCell>
                      {format(new Date(user.lastPaidMonth), "PPP")}
                    </TableCell>
                    <TableCell>${user.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          isPending(user.lastPaidMonth)
                            ? "text-red-500 dark:text-red-400"
                            : "text-green-500 dark:text-green-400"
                        }
                      >
                        {isPending(user.lastPaidMonth) ? "Pending" : "Paid"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

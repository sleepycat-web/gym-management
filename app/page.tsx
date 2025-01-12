"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, User, UserPen, Menu, X, IndianRupee, CloudDownload  } from "lucide-react";
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

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

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
  const [activeTab, setActiveTab] = useState("revenue");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const currentDate = new Date();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      // Cast the event to BeforeInstallPromptEvent
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
     
    // Clear the deferredPrompt variable
    setDeferredPrompt(null);
  };

  const handleDurationChange = (value: string | null) => {
    setDuration(value || "");
  };

  const handlePaymentMethodChange = (value: string | null) => {
    setPaymentMethod(value || "");
  };

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

  const UserTable = ({
    users,
    filter,
    status,
  }: {
    users: User[];
    filter: (lastPaidMonth: string) => boolean;
    status: string;
  }) => (
    <Table>
      <TableCaption>A list of {status.toLowerCase()} gym members.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead>Number</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Last Paid Month</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users
          .filter((user) => filter(user.lastPaidMonth))
          .map((user) => (
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
                    status === "Active"
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }
                >
                  {status}
                </span>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-neutral-100 dark:bg-neutral-900 p-4 z-50">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
            {activeTab === "register"
              ? "Register User"
              : activeTab === "revenue"
              ? "Revenue"
              : "Manage Users"}
          </h1>
          <div className="flex items-center gap-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
              onClick={handleInstallClick}
              style={{ display: deferredPrompt ? 'block' : 'none' }}
            >
              <CloudDownload />
            </Button>
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="mt-4 space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start text-neutral-900 dark:text-white
                ${
                  activeTab === "revenue"
                    ? "bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                    : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
                }`}
              onClick={() => {
                setActiveTab("revenue");
                setIsMobileMenuOpen(false);
              }}
            >
              <IndianRupee className="h-4 w-4 mr-2" />
              Revenue
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-neutral-900 dark:text-white
          ${
            activeTab === "register"
              ? "bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
          }`}
              onClick={() => {
                setActiveTab("register");
                setIsMobileMenuOpen(false);
              }}
            >
              <User className="h-4 w-4 mr-2" />
              Register User
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-neutral-900 dark:text-white
          ${
            activeTab === "manage"
              ? "bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
          }`}
              onClick={() => {
                setActiveTab("manage");
                setIsMobileMenuOpen(false);
              }}
            >
              <UserPen className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </nav>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="w-56 bg-neutral-100 dark:bg-neutral-900 p-4 hidden md:block">
        <h1 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-neutral-900 dark:text-white
              ${
                activeTab === "revenue"
                  ? "bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                  : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
              }`}
            onClick={() => setActiveTab("revenue")}
          >
            <IndianRupee className="h-4 w-4 mr-2" />
            Revenue
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-neutral-900 dark:text-white
              ${
                activeTab === "register"
                  ? "bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                  : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
              }`}
            onClick={() => setActiveTab("register")}
          >
            <User className="h-4 w-4 mr-2" />
            Register User
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-neutral-900 dark:text-white
              ${
                activeTab === "manage"
                  ? "bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                  : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
              }`}
            onClick={() => setActiveTab("manage")}
          >
            <UserPen className="h-4 w-4 mr-2" />
            Manage Users
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-4 mt-20 md:mt-0">
        <header className="  justify-between items-center mb-6 hidden md:flex">
          <h2 className="text-lg font-bold">
            {activeTab === "register"
              ? "Register User"
              : activeTab === "manage"
              ? "Manage Users"
              : "Revenue"}
          </h2>
          <div className="hidden md:flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
              onClick={handleInstallClick}
              style={{ display: deferredPrompt ? 'flex' : 'none' }}
            >
              <CloudDownload />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main>
          {activeTab === "register" ? (
            <form onSubmit={onSubmit} className="space-y-8 max-w-md">
              <div>
                <label>Name</label>
                <Input
                  placeholder="Enter the name"
                  value={name}
                  onChange={(e) => {
                    const sanitized = e.target.value.replace(/[<>?]/g, "");
                    setName(sanitized);
                  }}
                />
              </div>

              <div>
                <label>Phone</label>
                <Input
                  placeholder="Enter the phone number"
                  value={phone}
                  onChange={(e) => {
                    const sanitized = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setPhone(sanitized);
                  }}
                />
              </div>

              <div className="flex flex-col">
                <label>Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !date && "text-neutral-500 dark:text-neutral-400"
                      )}
                    >
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setdate(date)}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label>Duration</label>
                <Select onValueChange={handleDurationChange} value={duration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15 days">15 days</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label>Payment Method</label>
                <Select
                  onValueChange={handlePaymentMethodChange}
                  value={paymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label>Amount</label>
                <Input
                  placeholder="Enter the amount"
                  value={amount}
                  onChange={(e) => {
                    const sanitized = e.target.value.replace(/\D/g, "");
                    setAmount(sanitized);
                  }}
                />
              </div>

              <Button
                type="submit"
                disabled={
                  !name ||
                  !phone ||
                  !date ||
                  !duration ||
                  !paymentMethod ||
                  !amount
                }
              >
                Register User
              </Button>
            </form>
          ) : activeTab === "manage" ? (
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-sm">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <UserTable
                  users={users}
                  filter={(lastPaidMonth) => !isPending(lastPaidMonth)}
                  status="Active"
                />
              </TabsContent>
              <TabsContent value="pending">
                <UserTable
                  users={users}
                  filter={(lastPaidMonth) => isPending(lastPaidMonth)}
                  status="Pending"
                />
              </TabsContent>
              <TabsContent value="inactive">
                <UserTable
                  users={users}
                  filter={() => false}
                  status="Inactive"
                />
              </TabsContent>
            </Tabs>
          ) : (
            // Revenue Content
            <div></div>
          )}
        </main>
      </div>
    </div>
  );
}
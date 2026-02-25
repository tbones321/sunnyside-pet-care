package com.example.sunnyside.model;

import java.util.List;

public class RequestPayload {
    private String service;
    private String ownerName;
    private String address;
    private String email;
    private String phone;
    private List<Pet> pets;

    // Walk fields
    private String walkTime;
    private String duration;

    // Sitting fields
    private String fromDate;
    private String toDate;

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public List<Pet> getPets() { return pets; }
    public void setPets(List<Pet> pets) { this.pets = pets; }

    public String getWalkTime() { return walkTime; }
    public void setWalkTime(String walkTime) { this.walkTime = walkTime; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getFromDate() { return fromDate; }
    public void setFromDate(String fromDate) { this.fromDate = fromDate; }

    public String getToDate() { return toDate; }
    public void setToDate(String toDate) { this.toDate = toDate; }

    public static class Pet {
        private String name;
        private String species;
        private String breed;
        private String age;
        private String size;
        private String sex;
        private String weight;
        private List<String> vaccines;
        private List<String> behaviors;
        private String notes;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getSpecies() { return species; }
        public void setSpecies(String species) { this.species = species; }

        public String getBreed() { return breed; }
        public void setBreed(String breed) { this.breed = breed; }

        public String getAge() { return age; }
        public void setAge(String age) { this.age = age; }

        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }

        public String getSex() { return sex; }
        public void setSex(String sex) { this.sex = sex; }

        public String getWeight() { return weight; }
        public void setWeight(String weight) { this.weight = weight; }

        public List<String> getVaccines() { return vaccines; }
        public void setVaccines(List<String> vaccines) { this.vaccines = vaccines; }

        public List<String> getBehaviors() { return behaviors; }
        public void setBehaviors(List<String> behaviors) { this.behaviors = behaviors; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}
